/*
This javascript uses the google maps and google geocoder API's. When using it, 
keep in mind that the API key is tied to my credid card. With that said,
you get like, 2000 requests before I start getting charged 0.7 cents for further requests.
Every refresh is 1 request, every search is 1 request, zooming, toggling markers,
and switching from map to satellite is free.
*/

//Create the marker object for the loadMarkers function to push into
var markers = {
  bigfoot: [],
  hauntedplaces: [],
  ufosightings: []
};

//UFO and Haunted places had the state as an initial. This allows me to convert them to full state names later
var stateNames = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

//Make that map yo
function initMap() {
    //Create the map object and remove some things like street view and points of interest.
    map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 6,
    streetViewControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ]
  });

  //Grab the input from each checkbox. Iterate through the checkboxs with an event listener.
  var checkboxes = document.querySelectorAll('#checkboxes input');
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      //get the category from the box id and pass it into toggleMarkers function. This also passes if it is checked or not
      var category = checkbox.id.split('-')[0];
      toggleMarkers(markers[category], this.checked);
    });
  });

  //Get the reset button, if clicked run the showAllMarkers function
  var resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', function () {
    showAllMarkers();
  });

  showAllMarkers();

  //Call the loadMarkers function. This passes in a cetegory, API url, icon url, and key name arragments. 
  //The key names have been seperated because they were not all the same.
  loadMarkers('bigfoot', 'http://127.0.0.1:5000/api/v1.0/bigfoot', 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', {
    latitude: 'latitude',
    longitude: 'longitude',
    state: 'stateName',
    title: 'observered',
    country: null
  });

  loadMarkers('hauntedplaces', 'http://127.0.0.1:5000/api/v1.0/haunting', 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', {
    latitude: 'latitude',
    longitude: 'longitude',
    state: 'stateCode',
    title: 'summary',
    country: null
  });

  loadMarkers('ufosightings', 'http://127.0.0.1:5000/api/v1.0/UFO', 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png', {
    latitude: 'latitude',
    longitude: 'longitude',
    state: 'stateCode',
    title: 'summary',
    country: 'country'
  });

  var searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', function () {
    //As long as the state select and city search input is not empty, it will call the filterMarkers function.
    if ((document.getElementById('state-select').value !== '') || (document.getElementById('city-input').value !== '')){
      filterMarkers();
    }
  });
}

//This function take the information pass above and displays the markers on the map accordingly.
function loadMarkers(category, dataUrl, markerIconUrl, keyNames) {
  //Make the API request, json'ify it, and itterate
  fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(row => {
        if (row[keyNames.country] === 'USA' || keyNames.country == null) {
          const lat = row[keyNames.latitude];
          const lng = row[keyNames.longitude];
          const state = row[keyNames.state];
          const title = row[keyNames.title];         
          //Make it beutifull
          const markerIcon = {
            url: markerIconUrl,
            scaledSize: new google.maps.Size(15, 15),
            origin: new google.maps.Point(0, 0),
          };
          
          //Make a marker for each row in the API.
          //This uses the key: values passed in the keyNames object when the function is called
          let marker;
          if (category == 'bigfoot'){
            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
              title,
              icon: markerIcon,
              category,
              state,
            });
          } else {
            //This converts state initials to full spelling using the object created at the beginning.
            const stateName = stateNames[state] || state;
            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
              title,
              icon: markerIcon,
              category,
              state: stateName,
            });
          }
          //Starting populating the marker object
          markers[category].push(marker);
        }
      });
    })
    //if there is an error post it on the dev console
    .catch(error => {
      console.error(error);
    });
}

//Utilized in the event listener in the initMap function. It hides markers from unchecked boxes
//categoryMarkers is the first half of the checkbox ID, and visible is from "this.checked"
function toggleMarkers(categoryMarkers, visible) {
  categoryMarkers.forEach(function (marker) {
    marker.setVisible(visible);
  });
}

//Only used when the reset button is pressed or the map is initialized
//Set all markers visible and attaches them to the map object.
function showAllMarkers() {
  Object.values(markers).forEach(function (categoryMarkers) {
    categoryMarkers.forEach(function (marker) {
      marker.setVisible(true);
      marker.setMap(map);
    });
  });
}

/*
These next two functions were a huge pain in the ass, please give us a good grade.
When the search button is pressed this takes the values in the state and city input, and filters
them based on the state column in the data, and the geocoded location of the city.
*/
function filterMarkers() {
  var stateSelect = document.getElementById('state-select').value;
  var cityInput = document.getElementById('city-input').value;
  //Create the geocoder object. This stores the information requested from google maps geocoding API
  var geocoder = new google.maps.Geocoder();
  var filterBounds = null;
  /*
  If city input is not empty this concats a string to find relavent address data within the US 
  (searching Georgia would find the country), and create the filterBounds object to store the
  latitude and longitute information in.
  */
  if (cityInput !== '') {
    geocoder.geocode({ address: cityInput + ', ' + stateSelect, componentRestrictions: { country: 'US' } }, function (results, status) {
      if (status === 'OK' && results.length > 0) {
        filterBounds = results[0].geometry.viewport;
        applyFilter();
      } else {
        console.error(status);
      }
    });
  //This runs the same thing as above for the state selection.
  } else if (stateSelect !== '') {
    geocoder.geocode({ address: stateSelect, componentRestrictions: { country: 'US' } }, function (results, status) {
      if (status === 'OK' && results.length > 0) {
        filterBounds = results[0].geometry.viewport;
        applyFilter();
      } else {
        console.error(status);
      }
    });
  }

  //Ran from the filterMarkers funtion. This removes unwanted markers and zooms to the location
  function applyFilter() {
    Object.values(markers).forEach(function (categoryMarkers) {
      categoryMarkers.forEach(function (marker) {
        var markerLatLng = marker.getPosition();
        var isWithinBounds = filterBounds ? filterBounds.contains(markerLatLng) : true;
        var isMatchingState = stateSelect !== '' ? marker.state === stateSelect : true;

        if (isWithinBounds && isMatchingState) {
          marker.setVisible(true);
          marker.setMap(map);
        } else {
          marker.setVisible(false);
          marker.setMap(null);
        }
      });
    });

    if (filterBounds) {
      map.fitBounds(filterBounds);
    }
  }
}

initMap();