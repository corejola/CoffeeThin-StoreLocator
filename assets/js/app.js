//initMap lat/lng should be based off the user zip code input
function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 34.0522, lng: -118.2437 }
    };
    // var map = new google.maps.Map($('#map'), options);
    //issues with using map api & jquery...
    var map = new google.maps.Map(document.getElementById('map'), options);

    var map, infoWindow;

    infoWindow = new google.maps.InfoWindow;

    var marker = [
        {
            coords: { lat: 34.0522, lng: -118.2437 },
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h3> Store Location Information Here</h3>'
        },
        {
            coords: { lat: 34.0689, lng: -118.4452 },
            // iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h3> Store Location Information Here</h3>'
        },
        {
            coords: { lat: 34.0195, lng: -118.4912 },
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h3> Store Location Information Here</h3>'
        }
    ];
    for (var i = 0; i < marker.length; i++) {
        addMarker(marker[i]);
    };
    //add marker function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            // icon: props.iconImage
        });
        //checks for icon image
        if (props.iconImage) {
            //set icon image
            marker.setIcon(props.iconImage);
        }
        // similar check for content...
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        };

    };
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

var zip = $('#location-input').val
var latitude = 34.0522342;
var longitude = -118.2436849;
var distance = 10;
var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/" + latitude + "/" + longitude + "/" + distance;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(JSON.parse(response));
    var JSONObject = JSON.parse(response);
    var products = JSONObject.products;
    var retailers = JSONObject.retailers;
    var stores = JSONObject.stores;
    console.log();

    //loop through Store Locator for Stores
    for (var i = 0; i < JSONObject.stores.length; i++) {
        var storeAddress = JSONObject.stores[i].address;
        var storeCity = JSONObject.stores[i].city;
        var storeCountry = JSONObject.stores[i].country;
        var storeDistance = JSONObject.stores[i].distance;
        var storeID = JSONObject.stores[i].id;
        var storeLatitude = JSONObject.stores[i].lat;
        var storeLongitude = JSONObject.stores[i].lng;
        var storeProducts = JSONObject.stores[i].products;
        var storeRetailer = JSONObject.stores[i].retailer;
        var storeState = JSONObject.stores[i].state;
        var storeZip = JSONObject.stores[i].zip;

        var names = $("<div>").append(
            $('<p>').text(JSONObject.stores[i].address),
            $('<p>').text(JSONObject.stores[i].city + ", "),
            $('<p>').text(Math.floor(JSONObject.stores[i].distance) + " Miles Away")
        )

        $('#JSON').append(names)

    }

    // 1. need to for/in loop through the product information based on the specific store product
    // 2. need to for/in loop through the retailers based on the store retailer id
    for (var i = 0; i < JSONObject.products.length; i++) {
        var productName = JSONObject.products[i].name;
        var productID = JSONObject.products[i].id;
        var productTitle = JSONObject.products[i].title;
    }

    for (var i = 0; i < JSONObject.retailers.length; i++) {
        var retailerName = JSONObject.retailers[i].name;
        var retailerID = JSONObject.retailers[i].id;
    }

});


