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
      userLat = data.results[0].geometry.location.lat;
      userLon = data.results[0].geometry.location.lng;
      initMap(userLat, userLon)
    });
}

rests.addEventListener('click', function(event) {
  var element = event.target;

  if (element.matches('button') === true) {
    var btnAttribute = element.getAttribute('id');
    var restaurantName = element.getAttribute('data-restaurant');
    getGeocode(btnAttribute);
    checkLocalStorage(restaurantName)
  }
})

// ##################### Google Place Search API #####################
var restaurantName =[];
var celebrityChef = ["Aaron Franklin","Anthony Bourdain","Paul Qui"];
var finalArray =[];
const displayName = document.getElementById("restaurantName");
const displayAddress = document.getElementById("restaurantAddress");
const displayRating = document.getElementById("restaurantRating");
const displayPrice = document.getElementById("restaurantPrice");
const displayType = document.getElementById("restaurantType");
var dollarSymbol = "";
var restaurantInfo = 
{ 
  name: "",
  address: "",
  rating: "",
  price_level: "",
  type: "",
}; 

//check local storage before send out a query
function checkLocalStorage(restaurantName){

  if (localStorage.length > 0){

    for (var restaurantIndex = 0; restaurantIndex < localStorage.length; restaurantIndex++){

      if (restaurantName === localStorage.key(restaurantIndex)){
        displayData(restaurantName);
      }

      else if (restaurantIndex >= localStorage.length-1){
        queryData(restaurantName);
      }

      else {
      }
    }    
  }
  else{
    queryData(restaurantName);
  }
}

//Google Place Search API function
function queryData (restaurantName){

  finalArray = [];
  var austin = new google.maps.LatLng(30.26477, -97.75025);

  //request parameter
  const request = {
    query: restaurantName,
    fields: ["name","formatted_address","rating","price_level","type"],
    locationBias: austin,
  }
    
  //call back function
  const callback = (response, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      //save data from query to an defined local object
      restaurantInfo.name = response[0].name;
      restaurantInfo.address = response[0].formatted_address;
      restaurantInfo.rating = response[0].rating;
      restaurantInfo.price_level = response[0].price_level;
      restaurantInfo.type = response[0].types[0];

      //convert data from object to string and save to the local storage
      finalArray = Object.values(restaurantInfo);
      localStorage.setItem(restaurantName, JSON.stringify(finalArray));
      displayData(restaurantName);
      }
    }

  //place search API call
  const places = document.getElementById('places');
  var service = new google.maps.places.PlacesService(places);
  service.findPlaceFromQuery(request,callback);
}

//Display Data Function
function displayData(restaurantName){

  var star = "⭐⭐⭐⭐☆";

  //get data from local storage
  displayArray = JSON.parse(localStorage.getItem(restaurantName));

  var priceLevel = displayArray[3];
  dollarSign(priceLevel);

  displayName.innerText = "Name: " + displayArray[0];
  displayAddress.innerText = "Address: " + displayArray[1];
  displayRating.innerText = "Rating: " + displayArray[2] + " " + star;
  displayPrice.innerText = "Price: " + displayArray[3] + " " + dollarSymbol;
  displayType.innerText = "Type: " + displayArray[4];

  displayImg(restaurantName);
}

//display image function
function displayImg (restaurantName) {
  var imgName = "./assets/images/" + restaurantName + ".jpeg";
  document.getElementById('foodImg').src = imgName;
}

//dollar sign function
function dollarSign(priceLevel){
 
  dollarSymbol = "";
  priceSymbol = "$";
  for (var i=0; i<priceLevel; i++){
    dollarSymbol = dollarSymbol + priceSymbol;
  }
}
