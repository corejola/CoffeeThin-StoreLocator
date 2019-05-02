
var map;
var markers = [];
var infoWindow;


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

            // stores user coordinates into a variable
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // displays infowindow for user location
            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos);

            // handles errors when user does not agree to let browser use their location
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    };

    var geocoder = new google.maps.Geocoder();


    document.getElementById('locate-button').addEventListener('click', function () {
        geocodeAddress(geocoder, map);
    });

    // function to search addresses/locations
    function geocodeAddress(geocoder, resultsMap) {

        var address = document.getElementById('location-input').value;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                // commented this out because it placed a marker at search location
                // var marker = new google.maps.Marker({
                //     map: resultsMap,
                //     position: results[0].geometry.location
                // });

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }

            console.log(results[0].geometry.location.lat());

            // Query parameters for pulling store locator API
            var key = "dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9";
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var distance = document.getElementById('miles-input').value;;
            var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/" + key + "/get-stores/" + latitude + "/" + longitude + "/" + distance;

            // display markers for nearby store locations
            function storeMarkers() {
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {

                    console.log(JSON.parse(response));
                    var JSONObject = JSON.parse(response);

                    for (var i = 0; i < JSONObject.stores.length; i++) {

                        var storesLat = JSONObject.stores[i].lat;
                        var storesLng = JSONObject.stores[i].lng;

                        var marker = new google.maps.Marker({ position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) }, map: map });

                    };

                });
            };

            storeMarkers();

        });

    };
};

   

