getGeocode();

function initMap(userLat, userLon) {
    // The location of the restaurant
    const local = { lat: userLat, lng: userLon};
    // Centers map on restaurant
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: local,
    });
    // places marker on restaurant
    const marker = new google.maps.Marker({
      position: local,
      map: map,
    });
  }
  
  window.initMap = initMap;

  function getGeocode () {

    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=8624874G%2BV2&key=AIzaSyDVM4nCzUY3gFGHGXhyDnzXz8ZZbcT0e1w`;

    fetch(geocodeUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // console.log(data.results[0].geometry.location.lat);
            // console.log(data.results[0].geometry.location.lng);
            var userLat = data.results[0].geometry.location.lat;
            var userLon = data.results[0].geometry.location.lng;
            // console.log(userLat);
            // console.log(userLon);
            initMap(userLat, userLon)
        });
}

//Still requires fx to add user input (Plus Code) to getGeocode fx which includes changing all "+" in plus code to %2B