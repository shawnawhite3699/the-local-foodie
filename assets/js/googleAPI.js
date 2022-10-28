//'rests' is a placeholder. Will need restaurants in a specific div with id
var rests = document.getElementById('rests');
//console.log(rests);

function initMap(userLat, userLon) {
    // Lat and lon of restaurant pulled from getGeocode fx
    const local = { lat: userLat, lng: userLon};
    // Centers map on restaurant
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: local,
    });
    // Positions marker on restaurant
    const marker = new google.maps.Marker({
      position: local,
      map: map,
    });
  }
  
window.initMap = initMap;

function getGeocode (btnAttribute) {
  //Line below will be used once buttons are coded in. Line two below is a placeholder for design layout
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${btnAttribute}&key=AIzaSyDVM4nCzUY3gFGHGXhyDnzXz8ZZbcT0e1w`;
  //var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=862487R6%2BGM&key=AIzaSyDVM4nCzUY3gFGHGXhyDnzXz8ZZbcT0e1w`;


  fetch(geocodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data);
      // console.log(data.results[0].geometry.location.lat);
      // console.log(data.results[0].geometry.location.lng);
      userLat = data.results[0].geometry.location.lat;
      userLon = data.results[0].geometry.location.lng;
      console.log(userLat);
      console.log(userLon);
      initMap(userLat, userLon)
    });
}

rests.addEventListener('click', function(event) {
  var element = event.target;

  if (element.matches('button') === true) {
    var btnAttribute = element.getAttribute('id');
    var dataIndex = element.getAttribute('data-index')
    getGeocode(btnAttribute);
    console.log("Horray!")
    displayData(dataIndex)
  }
})

