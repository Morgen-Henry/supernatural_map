var map;
var bounds = null;
var markers = {
  bigfoot: [],
  hauntedplaces: [],
  ufosightings: []
};

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

function initMap() {
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

  var checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var category = checkbox.id.split('-')[0];
      toggleMarkers(markers[category], this.checked);
    });
  });

  var resetButton = document.getElementById('reset-button');

  resetButton.addEventListener('click', function () {
    showAllMarkers();
  });

  showAllMarkers();

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

    if ((document.getElementById('state-select').value !== '') || (document.getElementById('city-input').value !== '')){
      filterMarkers();
    } else {
      showAllMarkers();
    }
  });
}

function loadMarkers(category, dataUrl, markerIconUrl, keyNames) {
  fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(row => {
        if (row[keyNames.country] === 'USA' || keyNames.country == null) {
          const lat = row[keyNames.latitude];
          const lng = row[keyNames.longitude];
          const state = row[keyNames.state];
          const title = row[keyNames.title];

          const markerIcon = {
            url: markerIconUrl,
            scaledSize: new google.maps.Size(15, 15),
            origin: new google.maps.Point(0, 0),
          };
          
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

          markers[category].push(marker);
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function toggleMarkers(categoryMarkers, visible) {
  categoryMarkers.forEach(function (marker) {
    marker.setVisible(visible);
  });
}

function showAllMarkers() {
  Object.values(markers).forEach(function (categoryMarkers) {
    categoryMarkers.forEach(function (marker) {
      marker.setVisible(true);
      marker.setMap(map);
    });
  });

  if (bounds !== null) {
    map.fitBounds(bounds);
  }
}

function filterMarkers() {
  var stateSelect = document.getElementById('state-select').value;
  var cityInput = document.getElementById('city-input').value;

  var geocoder = new google.maps.Geocoder();
  var filterBounds = null;

  if (cityInput !== '') {
    geocoder.geocode({ address: cityInput + ', ' + stateSelect, componentRestrictions: { country: 'US' } }, function (results, status) {
      if (status === 'OK' && results.length > 0) {
        filterBounds = results[0].geometry.viewport;
        applyFilter();
      } else if (status === 'ZERO_RESULTS') {
        clearMarkers();
      } else {
        console.error(status);
      }
    });
  } else if (stateSelect !== '') {
    geocoder.geocode({ address: stateSelect, componentRestrictions: { country: 'US' } }, function (results, status) {
      // ...
      if (status === 'OK' && results.length > 0) {
        var location = results[0].geometry.location;
        filterBounds = new google.maps.LatLngBounds(location, location);

        if (results[0].geometry.viewport) {
          var viewport = results[0].geometry.viewport;
          filterBounds.union(viewport);
        }

        applyFilter();
      } else {
        console.error(status);
      }
    });
  } else {
    showAllMarkers();
  }

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