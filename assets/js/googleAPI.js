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
    var dataIndex = element.getAttribute('data-index');
    getGeocode(btnAttribute);
    //console.log("Horray!")
    displayData(dataIndex)
  }
})



// ##################### Google Place Search API #####################
var restaurantName =[];
var celebrityChef = ["Aaron Franklin","Anthony Bourdain","Paul Qui"];
var chefName ="";
var tempArray = [];
var finalArray =[];
const displayName = document.getElementById("restaurantName");
const displayAddress = document.getElementById("restaurantAddress");
const displayRating = document.getElementById("restaurantRating");
const displayPrice = document.getElementById("restaurantPrice");
const displayType = document.getElementById("restaurantType");
var chefNameIndex = document.getElementById("chef-name");
var chefIndex = chefNameIndex.getAttribute('data-chef');
var chefRecommend =
[
aaronFranklin = ["Veracruz All Natural","Launderette","Lenoir","Suerte","ElDorado Cafe","Franklin Barbecue","Loro","Uchi","Uchiko"],
anthonyBourdain = ["Barley Swine","Franklin Barbecue","Tacos Ricos","Draught House Pub & Brewery","El Azteca Restaurant","Lala's Little Nugget","Joe's Bakery & Coffee Shop","Texas Chili Parlor"],
paulQui = ["Las Trancas Taco Stand","Salt & Time","Qi Austin: Modern Asain Kitchen","Musashino Sushi Dokoro","East Side King","Justine's","Franklin Barbecue","Juan Pelota Cafe"],
];
var restaurantInfo = 
{ 
  name: "",
  address: "",
  rating: "",
  price_level: "",
  type: "",
}; 


if (chefIndex !== ""){
  chefName = celebrityChef[chefIndex];
  restaurantName = chefRecommend[chefIndex];
  queryData(restaurantName,chefName);
}

//Google Place Search API function
function queryData (restaurantName,chefName){

  var austin = new google.maps.LatLng(30.26477, -97.75025);

  for (var i=0;i<restaurantName.length;i++){

    const request = {
      query: restaurantName[i],
      fields: ["name","formatted_address","rating","price_level","type"],
      locationBias: austin,
    };

     var callback = (response, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {

        //save data from query to an defined local object
          restaurantInfo.name = response[0].name;
          restaurantInfo.address = response[0].formatted_address;
          restaurantInfo.rating = response[0].rating;
          restaurantInfo.price_level = response[0].price_level;
          restaurantInfo.type = response[0].types[0];

          //convert data from object to string and save to the local storage
          tempArray = Object.values(restaurantInfo);
          finalArray = finalArray.concat(tempArray);
          localStorage.setItem(chefName, JSON.stringify(finalArray));
        }
      }
    //place search API
    const places = document.getElementById('places');
    var service = new google.maps.places.PlacesService(places);
    service.findPlaceFromQuery(request,callback);
  }
}

//Display Data Function
function displayData(dataIndex){

  displayArray =[];
  var number = dataIndex*5;
  displayArray = JSON.parse(localStorage.getItem(chefName));

  displayName.innerText = "Name: " + displayArray[number];
  displayAddress.innerText = "Address: " + displayArray[number+1];
  displayRating.innerText = "Rating: " + displayArray[number+2];
  displayPrice.innerText = "Price: " + displayArray[number+3];
  displayType.innerText = "Type: " + displayArray[number+4];

}

