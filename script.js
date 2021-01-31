$(document).ready(function () {

  // Initialize the Materialize select element
  $('select').formSelect();

  // Global variables
  var apiKey = 'gv6tmP4JQDOhpB8OVmK9LaoSODwYWgPAVYqlFkJh';

  // Get last search from local storage and call displayParks
  var lastState = localStorage.getItem('lastState');
  console.log("lastState: " + lastState);

  var lastCoordStr = localStorage.getItem('lastCoord');
  console.log("lastCoord: " + lastCoordStr);
  var lastCoordObj = JSON.parse(lastCoordStr);

  displayParks(lastState);
  if (lastCoordObj !== null) {
    displayLastMap(lastCoordObj);
  }

  // Listen for submit button, save input in local storage, and call displayParks
  $('#search').click(function (event) {
    event.preventDefault();

    var stateElement = $('#state');
    var stateCode = stateElement.val();
    console.log("stateCode: " + stateCode);
    localStorage.setItem('lastState', stateCode);

    var activitiesElement = $('#activities');
    var instance = M.FormSelect.getInstance(activitiesElement);
    activitiesArray = instance.getSelectedValues();
    console.log("activitiesArray: " + activitiesArray);

    localStorage.setItem('lastCoord', null);

    displayParks(stateCode);
  });

  // Get response from API and write parks to table in page
  function displayParks(stateCode) {
    $('#table').empty();
    $('#map').empty();
    var queryURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + stateCode + '&api_key=' + apiKey;

    $.get({
      url: queryURL,
    }).then(function (response) {
      console.log(response);

      for (var i = 0; i < response.data.length; i++) {
        var tRow = $('<tr>');
        var parkName = $('<td>').text(response.data[i].fullName);
        var parkCity = $('<td>').text(response.data[i].addresses[0].city);
        var parkDescription = $('<td>').text(response.data[i].description);

        var mapBtn = $('<a>');
        mapBtn.addClass('waves-effect waves-light btn mapBtn')
        mapBtn.attr('data-index', i);
        mapBtn.text('MAP');
        mapBtn.on('click', function (event) {
          event.preventDefault();
          var index = $(this).attr('data-index');
          console.log("thisName: " + response.data[index].name);
          getLatLong(index);
        });

        tRow.append(parkName, parkCity, parkDescription, mapBtn);
        $('#table').append(tRow);
      }

      function getLatLong(index) {
        var latitude = response.data[index].latitude;
        var longitude = response.data[index].longitude;
        var coordinates = new google.maps.LatLng(latitude, longitude);
        console.log("thisCoord: " + coordinates);

        localStorage.setItem('lastCoord', JSON.stringify(coordinates));

        displayMap(coordinates);
      }

      // Initialize and add the map
      function displayMap(coordinates) {
        // The map, centered at park
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 6,
          center: coordinates,
        });
        // The marker, positioned at park
        const marker = new google.maps.Marker({
          position: coordinates,
          map: map,
        });
      }
    }).catch(function (error) {
      console.error(error);
    });
  }

  function displayLastMap(coordinates) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: coordinates,
    });
    const marker = new google.maps.Marker({
      position: coordinates,
      map: map,
    });
  }
}); //end of document ready function