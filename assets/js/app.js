//initMap lat/lng should be based off the user zip code input
var map;
var markers = [];
var infoWindow;
var locationSelect;

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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            // stores coordinates into a variable
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/34.0522342/-118.2436849/5";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
    });
    // Make request to API and get response before this point.
    var json = response.getContentText();
    var data = JSON.parse(json);
    console.log(data);

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

// var marker = [
//     {
//         coords: { lat: 34.0522, lng: -118.2437 },
//         iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//         content: '<h3> Store Location Information Here</h3>'
//     },
//     {
//         coords: { lat: 34.0689, lng: -118.4452 },
//         // iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//         content: '<h3> Store Location Information Here</h3>'
//     },
//     {
//         coords: { lat: 34.0195, lng: -118.4912 },
//         iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//         content: '<h3> Store Location Information Here</h3>'
//     }
// ];
// for (var i = 0; i < marker.length; i++) {
//     addMarker(marker[i]);
// };
// //add marker function
// function addMarker(props) {
//     var marker = new google.maps.Marker({
//         position: props.coords,
//         map: map,
//         // icon: props.iconImage
//     });
//     //checks for icon image
//     if (props.iconImage) {
//         //set icon image
//         marker.setIcon(props.iconImage);
//     }
//     // similar check for content...
//     if (props.content) {
//         var infoWindow = new google.maps.InfoWindow({
//             content: props.content
//         });

//         marker.addListener('click', function () {
//             infoWindow.open(map, marker);
//         });
//     };

// };



var zip = $('#location-input').val()
var latitude = 34.0522342;
var longitude = -118.2436849;
var distance = 25;
var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/" + latitude + "/" + longitude + "/" + distance;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    // var obj = JSON.parse(response);
    // console.log(obj)
    // console.log(obj.stores[0].lat);
    // console.log(obj.stores[0].lng);
    // // var storeLat = obj.stores[0].lat
    // // var storeLng = obj.stores[0].lng;
    // //try to parse out the JSON information to specific data

    // for (var i = 0; i < obj.stores.length; i++) {
    //     $("#JSON").html(obj.stores[i])
    // }

    //    console.log(typeof response);
    console.log(JSON.parse(response));
    var JSONObject = JSON.parse(response);
    var products = JSONObject.products;
    var retailers = JSONObject.retailers;
    var stores = JSONObject.stores;
    console.log(products);

    // 1. generate html markup for retailers
    // 2. append html
    for (var i = 0; i < JSONObject.products.length; i++) {
        var productName = JSONObject.products[i].name;
        var productID = JSONObject.products[i].id;
        var productTitle = JSONObject.products[i].title;
        console.log(productName);
        console.log(productID);
        console.log(productTitle);
    }

    for (var i = 0; i < JSONObject.retailers.length; i++) {
        var retailerName = JSONObject.retailers[i].name;
        var retailerID = JSONObject.retailers[i].id;
        console.log(retailerName);
        console.log(retailerID);
    }

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
        console.log(storeAddress);
        console.log(storeCity);
        console.log(storeCountry);
        console.log(storeDistance);
        console.log(storeID);
        console.log(storeLatitude);
        console.log(storeLongitude);
        console.log(storeProducts);
        console.log(storeRetailer);
        console.log(storeState);
        console.log(storeZip);
    }

});
