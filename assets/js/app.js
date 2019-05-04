//initMap lat/lng should be based off the user zip code input
var map;
var storeMarkers = [];
var infoWindow;
var locationSelect;
var currentLocation = { lat: 34.0522, lng: -118.2437 }; //default location

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

            currentLocation = pos;

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
                var storeProductIDs = JSON.parse(JSONObject.stores[i].products) || [];
                // || to ensure code doesn't break, set [];
                var storeRetailer = JSONObject.stores[i].retailer;
                var storeName = JSONObject.retailers.find(function(retailer) { return storeRetailer === retailer.id}).name;
                // turn string array to JS array, get product details, then create HTML string for info window
                // did in one variable to avoid creating unnecessary var's
                var productHTML = storeProductIDs
                                    .map(function(productId) {
                                        return JSONObject.products
                                                    .find(function(product) {
                                                        return productId === product.id
                                                    });
                                    })
                                    .reduce(function(result, p) { return result + p.title + '<br>';}, '');
                                    
                         
                                

                    // var storeProductIDs = [1, 2, 3, 4, 5];
                    // var productId = 3;
                    // for (let i = 0; i < storeProductIDs.length; i++) {
                    //     if(storeProductIDs[i]=== productId) {
                    //         return product.id
                    //     }
                    // }


                // LORRIE: (BEGINNING) OF CODE SNIPPET FOR BOUNCING ON MARKERS
                let marker = new google.maps.Marker(
                    {
                        position: { lat: parseFloat(JSONObject.stores[i].lat), lng: parseFloat(JSONObject.stores[i].lng) },
                        map: map,
                        // icon: ,
                        animation: google.maps.Animation.BOUNCE
                    });
                // LORRIE: (END) OF CODE SNIPPET FOR BOUNCING ON MARKERS



                marker.info = new google.maps.InfoWindow({
                    content: '<span>' + storeName + '<br>' + JSONObject.stores[i].address + '<br>' + JSONObject.stores[i].city + ', ' + JSONObject.stores[i].state + '<br>' + JSONObject.stores[i].zip + '<br>' + productHTML + '</span>'
                });

                marker.addListener('click', function () {
                    console.log("marker was pressed");
                    marker.info.open(map, marker)

                    // LORRIE: END OF CODE FOR PLACING STORENAME & PRODUCTS ON INFOWINDOW)

                    // marker.addListener ('click, toggleBounce');
                });
            }
        });
        // closes out function (response)
    };
    storeMarkers();

    function goBackToCenter(location) {
        map.setCenter(location);
    }
};
// LORRIE: (END) OF CODE SNIPPET FOR BOUNCING ON MARKERS, INFOWINDOW FOR MARKERS THAT SHOW FOR STORE LOCATIONS (MISSING STORE NAME & STORE PRODUCTS)  

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};







