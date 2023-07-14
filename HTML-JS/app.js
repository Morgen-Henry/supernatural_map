var map;
var bounds;
var markers = {
  bigfoot: [],
  hauntedplaces: [],
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.7128, lng: -74.0060 },
    streetViewControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },
    ],
  });

  bounds = new google.maps.LatLngBounds();

  loadMarkers('bigfoot', 'http://127.0.0.1:5000/api/v1.0/bigfoot', 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', 4, 5, 8);
  //loadMarkers('hauntedplaces', '../Data Cleaning/resources/hauntedplaces_data.csv', 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', 6, 5, 4);

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
}

function loadMarkers(category, dataUrl, markerIconUrl, latIndex, lngIndex, stateIndex) {
  Papa.parse(dataUrl, {
    download: true,
    skipEmptyLines: true,
    skipLinesWithEmptyValues: true,
    complete: function (results) {
      results.data.forEach((row, index) => {
        if (index === 0) {
          return;
        }

        var lat = parseFloat(row[latIndex]);
        var lng = parseFloat(row[lngIndex]);
        var state = row[stateIndex];

        var title = row[2];
        var markerIcon = {
          url: markerIconUrl,
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
        };

        var marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: title,
          icon: markerIcon,
          category: category,
          state: state,
        });
        markers[category].push(marker);
        bounds.extend(marker.getPosition());
      });

      map.fitBounds(bounds);
    },
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

function debugMarkers() {
    console.log(markers.bigfoot);
  }

function filterMarkersByCityAndState(city, state) {
    var newBounds = new google.maps.LatLngBounds();
  
    Object.values(markers).forEach(function (categoryMarkers) {
      categoryMarkers.forEach(function (marker) {
        var markerState = marker.state.toLowerCase();
        var stateInitial = getStateInitial(state).toLowerCase();
        var stateName = getStateName(state).toLowerCase();
  
        if (
          (city === '' || marker.title.toLowerCase().includes(city.toLowerCase())) &&
          (state === '' ||
            markerState === state.toLowerCase() ||
            markerState === stateInitial ||
            markerState === stateName)
        ) {
          marker.setMap(map);
          newBounds.extend(marker.getPosition());
        } else {
          marker.setMap(null);
        }
      });
    });
  
    if (!newBounds.isEmpty()) {
      map.fitBounds(newBounds);
    }
  }

function filterMarkersByState(state) {
  var newBounds = new google.maps.LatLngBounds();

  Object.values(markers).forEach(function (categoryMarkers) {
    categoryMarkers.forEach(function (marker) {
      if (marker.state.toLowerCase() === state.toLowerCase()) {
        marker.setMap(map);
        newBounds.extend(marker.getPosition());
      } else {
        marker.setMap(null);
      }
    });
  });

  if (!newBounds.isEmpty()) {
    map.fitBounds(newBounds);
  }
}

initMap();