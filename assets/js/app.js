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
//latitue & longitude to be replaced by user input
var latitude = 34.0522342;
var longitude = -118.2436849;
//distance to be replaced with user input
// $('#miles-input').val().trim()
var distance = 10;
var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/" + latitude + "/" + longitude + "/" + distance;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(JSON.parse(response));
    var JSONObject = JSON.parse(response);


    //This portion to be merged with the master
    var products = JSONObject.products;
    var retailers = JSONObject.retailers;
    var stores = JSONObject.stores;


    //loop through Store Locator for Stores
    for (var i = 0; i < stores.length; i++) {
        var storeAddress = stores[i].address;
        var storeDistance = stores[i].distance;
        var storeRetailer = stores[i].retailer;
        var names = $("<div>").append(
            $('<p>').text(storeRetailer),
            $('<p>').text(storeAddress),
            $('<p>').text(storeCity + ", "),
            $('<p>').text(Math.floor(storeDistance) + " Miles Away")
        )
        $('#JSON').append(names)
    }
    //end of portion to be merged with the master

    //Research lodash in order to find the information from Retailer & Products objects

    //retailer id from JSONObject is associated with store.retailer#
    // these loops will most likely be removed
    //Retailer & Products collections to be called on using lodash
    for (var i = 0; i < retailers.length; i++) {
        var retailerName = retailers[i].name;
        var retailerID = retailers[i].id;
        console.log(retailerID + " = " + retailerName)
    }

    for (var i = 0; i < products.length; i++) {
        var productName = products[i].name;
        var productID = products[i].id;
        var productTitle = products[i].title;
        console.log(productID + " " + productName + " " + productTitle)
    }

});


