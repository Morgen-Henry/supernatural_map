var map;
var bounds;
var markers = {
  bigfoot: [],
  hauntedplaces: [],
  ufosightings: []
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.7128, lng: -74.0060 },
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

  bounds = new google.maps.LatLngBounds();

  var checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var category = checkbox.id.split('-')[0];
      toggleMarkers(markers[category], this.checked);
    });
  });

  var searchButton = document.getElementById('search-button');
  var resetButton = document.getElementById('reset-button');

  resetButton.addEventListener('click', function () {
    showAllMarkers();
  });

  searchButton.addEventListener('click', function () {
    var stateSelect = document.getElementById('state-select');
    var selectedState = stateSelect.value;
    var cityInput = document.getElementById('city-input').value;

    if (cityInput.trim() !== '') {
      filterMarkersByCityAndState(cityInput, selectedState);
    } else if (selectedState.trim() !== '') {
      filterMarkersByState(selectedState);
    } else {
      showAllMarkers();
    }
  });

  showAllMarkers();

  loadMarkers('bigfoot', 'http://127.0.0.1:5000/api/v1.0/bigfoot', 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', {
    latitude: 'latitude',
    longitude: 'longitude',
    state: 'stateName',
    title: 'observered'
  });
  
  loadMarkers('hauntedplaces', 'http://127.0.0.1:5000/api/v1.0/haunting', 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', {
    latitude: 'latitude',
    longitude: 'longitude',
    state: 'stateCode',
    title: 'summary'
  });

loadMarkers('ufosightings', 'http://127.0.0.1:5000/api/v1.0/UFO', 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png', {
  latitude: 'latitude',
  longitude: 'longitude',
  state: 'stateCode',
  title: 'summary'
});
}

function loadMarkers(category, dataUrl, markerIconUrl, keyNames) {
  fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(row => {
        const lat = row[keyNames.latitude];
        const lng = row[keyNames.longitude];
        const state = row[keyNames.state];
        const title = row[keyNames.title];

        const markerIcon = {
          url: markerIconUrl,
          scaledSize: new google.maps.Size(15, 15),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
        };

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title,
          icon: markerIcon,
          category,
          state,
        });

        markers[category].push(marker);
        bounds.extend(marker.getPosition());
      });

      map.fitBounds(bounds);
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
      marker.setMap(map);
    });
  });

  map.fitBounds(bounds);
}

initMap();