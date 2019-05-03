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
    var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9/get-stores/" + latitude + "/" + longitude + "/" + distance;

    function storeMarkers() {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(JSON.parse(response));
            var JSONObject = JSON.parse(response);
            
    // LORRIE: BEGINNING OF CODE FOR PLACING STORENAME & PRODUCTS ON INFOWINDOW)
            for (var i = 0; i < JSONObject.stores.length; i++) {
                        var storesLat = JSONObject.stores[i].lat;
                        var storesLng = JSONObject.stores[i].lng;
                        var storeAddress = JSONObject.stores[i].address;
                        var storeCity = JSONObject.stores[i].city;
                        var storeID = JSONObject.stores[i].id;
                        var storeProductIDs = JSON.parse(JSONObject.stores[i].products) || [];
            // || to ensure code doesn't break, set []
                        var storeRetailer = JSONObject.stores[i].retailer;
                        var storeState = JSONObject.stores[i].state;
                        var storeZip = JSONObject.stores[i].zip;
                        var storeName = JSONObject.retailers.find(retailer => storeRetailer === retailer.id).name;
                        var productDetails = storeProductIDs.map(productId => 
                            JSONObject.products.find(product => productId === product.id)
                        );

                        var productHTML = productDetails.reduce((result, p) => result + p.title + '<br>', '');
 // LORRIE: (BEGINNING) OF CODE SNIPPET FOR BOUNCING ON MARKERS, INFOWINDOW FOR MARKERS THAT SHOW FOR STORE LOCATIONS (MISSING STORE NAME & STORE PRODUCTS)
 let marker = new google.maps.Marker(
    {
        position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) },
        map: map,
        // icon: ,
        animation: google.maps.Animation.BOUNCE
    });




marker.info = new google.maps.InfoWindow({
    content: '<span>' + storeName + '<br>' + storeAddress + '<br>' + storeCity + '<br>' + storeZip + '<br>' + productHTML + '</span>'
});

marker.addListener('click', function () {
    console.log("marker was pressed");
    marker.info.open(map, marker)

    // marker.addListener ('click, toggleBounce');
});
            }


           
        });
        // closes out function (response)
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





