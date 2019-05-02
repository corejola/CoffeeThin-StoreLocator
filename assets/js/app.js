//initMap lat/lng should be based off the user zip code input
var map;
var storeMarkers = [];
var infoWindow;
var locationSelect;

function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 34.0522, lng: -118.2437 }
    };

    map = new google.maps.Map(document.getElementById('map'), options);

    infoWindow = new google.maps.InfoWindow;

    // detects user location
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

    var zip = $('#location-input').val();
    var latitude = 34.0522342;
    var longitude = -118.2436849;
    var distance = 25;
    var retailerStoreName = [];
    var retailerStoreID = [];
    var coffeeProduct = [];
    var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/" + latitude + "/" + longitude + "/" + distance;

    function storeMarkers() {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(JSON.parse(response));
            var JSONObject = JSON.parse(response);
            // _.find((JSONObject), function (item) {
            //     return item.id === 1;
            // });
            for (var i = 0; i < JSONObject.retailers.length; i++) {
                var retailerName = JSONObject.retailers[i].name;
                var retailerID = JSONObject.retailers[i].id;
                // retailerStoreName.push(retailerName);
                // console.log(retailerStoreName);
                // retailerStoreID.push(retailerID);
            };
            for (var i = 0; i < JSONObject.products.length; i++) {
                var productName = JSONObject.products[i].name;
                var productID = JSONObject.products[i].id;
                var productTitle = JSONObject.products[i].title;
                // coffeeProduct.push(productID)
            };
            for (var i = 0; i < JSONObject.stores.length; i++) {
                var storesLat = JSONObject.stores[i].lat;
                var storesLng = JSONObject.stores[i].lng;
                var storeAddress = JSONObject.stores[i].address;
                var storeCity = JSONObject.stores[i].city;
                var storeID = JSONObject.stores[i].id;
                var storeProducts = JSONObject.stores[i].products;
                var storeRetailer = JSONObject.stores[i].retailer;
                var storeState = JSONObject.stores[i].state;
                var storeZip = JSONObject.stores[i].zip;
                
                // if (storeProducts === "[2,1]" || storeProducts === "[1,2]" ) {
                //     var products = JSONObject.products[0].title, JSONObject.products[1].title
                //  else if (storeProducts === "[2]") {
                //     var products = "Caramel";
                // // }
                // // else {
                //     var products = "Original Blend";
                // }
               
                // console.log(retailerID);
                // STORE CHECK: CVS: 6588 Foothill BlvdTujunga, CA 91042
                if (storeRetailer === retailerStoreID) {
                    var storeName = retailerStoreName
                }
                // console.log(retailerID);
// LORRIE: (BEGINNING) OF CODE SNIPPET FOR BOUNCING ON MARKERS, INFOWINDOW FOR MARKERS THAT SHOW FOR STORE LOCATIONS (MISSING STORE NAME & STORE PRODUCTS)
                let marker = new google.maps.Marker(
                    { 
                        position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) }, 
                        map: map,
                        // icon: ,
                        animation: google.maps.Animation.BOUNCE
                    });
                marker.info = new google.maps.InfoWindow({
                    content: '<span>' + storeName + '<br>'+ storeAddress + '<br>' + storeCity + '<br>' + storeZip + '<br>' + storeProducts + '</span>' 
                });
                
                marker.addListener('click', function(){
                    console.log("marker was pressed");
                    marker.info.open(map, marker)  
                
                // marker.addListener ('click, toggleBounce');
                });
            };
        });
    };
    storeMarkers();
};
// LORRIE: (END) OF CODE SNIPPET FOR BOUNCING ON MARKERS, INFOWINDOW FOR MARKERS THAT SHOW FOR STORE LOCATIONS (MISSING STORE NAME & STORE PRODUCTS)  

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
};
    
//     //    console.log(typeof response);
//     console.log(JSON.parse(response));
//     var JSONObject = JSON.parse(response);
//     var products = JSONObject.products;
//     var retailers = JSONObject.retailers;
//     var stores = JSONObject.stores;
//     console.log(products);

//     
//     for (var i = 0; i < JSONObject.products.length; i++) {
//         var productName = JSONObject.products[i].name;
//         var productID = JSONObject.products[i].id;
//         var productTitle = JSONObject.products[i].title;
        // var iconImage = JSONObject.products[i].imageurl;
//         console.log(productName);
//         console.log(productID);
//         console.log(productTitle);
//     }

//     for (var i = 0; i < JSONObject.retailers.length; i++) {
//         var retailerName = JSONObject.retailers[i].name;
//         var retailerID = JSONObject.retailers[i].id;
//         console.log(retailerName);
//         console.log(retailerID);
//     }

//     for (var i = 0; i < JSONObject.stores.length; i++) {
//         var storeAddress = JSONObject.stores[i].address;
//         var storeCity = JSONObject.stores[i].city;
//         var storeCountry = JSONObject.stores[i].country;
//         var storeDistance = JSONObject.stores[i].distance;
//         var storeID = JSONObject.stores[i].id;
//         var storeLatitude = JSONObject.stores[i].lat;
//         var storeLongitude = JSONObject.stores[i].lng;
//         var storeProducts = JSONObject.stores[i].products;
//         var storeRetailer = JSONObject.stores[i].retailer;
//         var storeState = JSONObject.stores[i].state;
//         var storeZip = JSONObject.stores[i].zip;
//         console.log(storeAddress);
//         console.log(storeCity);
//         console.log(storeCountry);
//         console.log(storeDistance);
//         console.log(storeID);
//         console.log(storeLatitude);
//         console.log(storeLongitude);
//         console.log(storeProducts);
//         console.log(storeRetailer);
//         console.log(storeState);
//         console.log(storeZip);
//     }

// });


