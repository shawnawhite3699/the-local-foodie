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
    });
}

//Event listener for all buttons
rests.addEventListener('click', function(event) {
  var element = event.target;

  if (element.matches('button') === true) {
    var btnAttribute = element.getAttribute('id');
    var dataIndex = element.getAttribute('data-index');
    getGeocode(btnAttribute);
    //console.log("Horray!")
    displayData(dataIndex); 
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
aaronFranklin = ["Veracruz All Natural","Launderette","Lenoir","Suerte","ElDorado Cafe","Franklin Barbecue","Loro","Uchiko"],
anthonyBourdain = ["Barley Swine","Franklin Barbecue","Draught House Pub & Brewery","Lala's Little Nugget","Joe's Bakery & Coffee Shop","Texas Chili Parlor"],
paulQui = ["Juiceland","Las Trancas Taco Stand","Salt & Time","Qi Austin: Modern Asain Kitchen","Musashino Sushi Dokoro","Justine's","Franklin Barbecue","Juan Pelota Cafe"],
];
var restaurantInfo = 
{ 
  name: "",
  address: "",
  rating: "",
  price_level: "",
  type: "",
}; 
var star = "⭐⭐⭐⭐☆"
chefName = celebrityChef[chefIndex];
restaurantName = chefRecommend[chefIndex];

if (chefIndex !== "" && localStorage.key(chefIndex) !== celebrityChef[chefIndex]){
  queryData(restaurantName,chefName);
}

//Google Place Search API function
function queryData (restaurantName,chefName){
  tempArray = [];
  finalArray = [];
  var austin = new google.maps.LatLng(30.26477, -97.75025);
  console.log(restaurantName);
  for (var i=0;i<restaurantName.length;i++){

    const request = {
      query: restaurantName[i],
      fields: ["name","formatted_address","rating","price_level","type"],
      locationBias: austin,
    };

     const callback = (response, status) => {
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
          console.log(finalArray);
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
  displayRating.innerText = "Rating: " + displayArray[number+2] + " " + star;
  displayPrice.innerText = "Price: " + displayArray[number+3];
  displayType.innerText = "Type: " + displayArray[number+4];

  displayImg(number);
}

//Function that displays the image of food based off of restaurant name
function displayImg (number) {
  //Variable for path name of image that takes in Google Place API restaurant name, removes all spaces, and attaches a .jpeg to end
  var imgName = `./assets/images/${displayArray[number].replace(/\s+/g, '')}.jpeg`;
  //console.log(imgName)
  document.getElementById('foodImg').src = imgName;

}
