$(document).ready(function () {

  // Initialize the Materialize select element
  $('select').formSelect();

  // Global variables
  var apiKey = 'gv6tmP4JQDOhpB8OVmK9LaoSODwYWgPAVYqlFkJh';

  // Get last search from local storage and call displayParks
  var lastState = localStorage.getItem("lastState");
  console.log("Last state: " + lastState);
  if (lastState !== null) {
    displayParks(lastState);
  }

  // Listen for submit button, save input in local storage, and call displayParks
  $('#search').click(function (event) {
    event.preventDefault();

    var stateElement = $('#state');
    var stateCode = stateElement.val();
    localStorage.setItem("lastState", stateCode);

    var activitiesElement = $('#activities');
    var instance = M.FormSelect.getInstance(activitiesElement);
    activitiesArray = instance.getSelectedValues();
    console.log("activitiesArray: " + activitiesArray);

    displayParks(stateCode);
  });

  // Get response from API and write parks to table in page
  function displayParks(stateCode) {
    var queryURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + stateCode + '&api_key=' + apiKey;

    $.get({
      url: queryURL,
    }).then(function (response) {
      console.log(response);

      $('#table').empty();
      for (var i = 0; i < response.data.length; i++) {
        var parkName = $('<td>').text(response.data[i].fullName);
        var parkCity = $('<td>').text(response.data[i].addresses[0].city);
        var parkDescription = $('<td>').text(response.data[i].description);
        var tRow = $('<tr>');
        tRow.append(parkName, parkCity, parkDescription);
        $('#table').append(tRow);
      }

      var coordinatesArray = [];
      for (var j = 0; j < response.data.length; j++) {
        var coordinate = response.data[j].latLong;
        coordinatesArray.push(coordinate);
      }
      console.log("coordinatesArray: " + coordinatesArray);
    }).catch(function (error) {
      console.error(error);
    });
  }

}); //end of document ready function