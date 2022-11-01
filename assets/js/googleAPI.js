//Variable to link restaurant buttons to a single event listener
var rests = document.getElementById('rests');
//console.log(rests);

//Map function
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

//Initializes map
window.initMap = initMap;

//Function that takes Google Plus Code attached as a button ID and brings back lat and long for location then feeds into the initMap fx
function getGeocode (btnAttribute) {
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${btnAttribute}&key=AIzaSyDVM4nCzUY3gFGHGXhyDnzXz8ZZbcT0e1w`;

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
      //console.log(userLat);
      //console.log(userLon);
      initMap(userLat, userLon)

      var savedLatLon = [userLat, userLon];
      localStorage.setItem("savedLatLon", JSON.stringify(savedLatLon));   
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
var restaurantInfo = 
{ 
  name: "",
  address: "",
  rating: "",
  price_level: "",
  type: "",
}; 
var star = "⭐⭐⭐⭐☆"

//check local storage before send out a query
function checkLocalStorage(restaurantName){

  if (localStorage.length > 0){
    for (var i=0;i<localStorage.length;i++){
      if (restaurantName === localStorage.key(i)){
          displayData(restaurantName)
          console.log("hello");
      }
      else{
        queryData(restaurantName);
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

  var savedArray = [];
  savedArray = Object.values(restaurantInfo);
  localStorage.setItem('savedArray', JSON.stringify(savedArray));

  //console.log(storedData)

      displayData(restaurantName);
      }
    }

  //place search API
  const places = document.getElementById('places');
  var service = new google.maps.places.PlacesService(places);
  service.findPlaceFromQuery(request,callback);

}

//Display Data Function
function displayData(restaurantName){

  displayArray = JSON.parse(localStorage.getItem(restaurantName));

  displayName.innerText = "Name: " + displayArray[0];
  displayAddress.innerText = "Address: " + displayArray[1];
  displayRating.innerText = "Rating: " + displayArray[2] + " " + star;
  displayPrice.innerText = "Price: " + displayArray[3];
  displayType.innerText = "Type: " + displayArray[4];


  displayImg(restaurantName);
  //renderSavedData(displayArray);


}

//display image 
function displayImg (restaurantName) {
  //var imgName = `./assets/images/${displayArray[restaurantName].replace(/\s+/g, '')}.jpeg`;
  var imgName = "./assets/images/" + restaurantName + ".jpeg";
  document.getElementById('foodImg').src = imgName;
}


function renderSavedData () {
  var storedData = JSON.parse(localStorage.getItem("savedArray"));
 
  displayName.innerText = "Name: " + storedData[0];
  displayAddress.innerText = "Address: " + storedData[1];
  displayRating.innerText = "Rating: " + storedData[2] + " " + star;
  displayPrice.innerText = "Price: " + storedData[3];
  displayType.innerText = "Type: " + storedData[4];

  var storedImg = "./assets/images/" + storedData[0] + ".jpeg";
  document.getElementById('foodImg').src = storedImg;

  var storedLatLon = JSON.parse(localStorage.getItem("savedLatLon"));
  //console.log(storedLatLon)

   userLat = storedLatLon[0];
   userLon = storedLatLon[1];

   initMap(userLat, userLon);
  


}
renderSavedData();