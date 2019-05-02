var map;
var markers = [];
var infoWindow;

// initializes the map when page loads
function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 34.0522, lng: -118.2437 }
    };
  
    // stores new map object into a variable

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

            // displays infowindow for user location when detected
            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos);

            // places marker at user location when their location is detected
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            });

            markers.push(marker);


            // handles errors when user does not agree to let browser detect their location

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    };

    // notification geolocation service fails
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);

    };

    // Autocomplete function
    var input = document.getElementById('location-input');

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        document.getElementById('location-snap').innerHTML = place.formatted_address;
        document.getElementById('lat-span').innerHTML = place.geometry.location.lat();
        document.getElementById('lon-span').innerHTML = place.geometry.location.lng();
    });

    // stores new Geocoder object into a variable
    var geocoder = new google.maps.Geocoder();

    document.getElementById('locate-button').addEventListener('click', function () {
        // removes markers after submitting new search
        removeMarkers();
        geocodeAddress(geocoder, map);
    });

    // function to search addresses/locations
    function geocodeAddress(geocoder, resultsMap) {

        var address = document.getElementById('location-input').value;

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);

                // places a marker at user input location
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                });

                markers.push(marker);

                // commented this out because it placed a marker at search location
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });


            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            };

            console.log(results[0].geometry.location.lat());

            // Query parameters for pulling store locator API
            var key = "dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9";
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var distance = document.getElementById('miles-input').value;;
            var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/" + key + "/get-stores/" + latitude + "/" + longitude + "/" + distance;

            // display markers for nearby store locations relative to searched location
            function storeMarkers() {
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {

                    console.log(JSON.parse(response));
                    var JSONObject = JSON.parse(response);

                    // var products = JSONObject.products;
                    // var retailers = JSONObject.retailers;
                    var stores = JSONObject.stores;

                    for (var i = 0; i < JSONObject.stores.length; i++) {

                        var storesLat = JSONObject.stores[i].lat;
                        var storesLng = JSONObject.stores[i].lng;

                        var storeCity = stores[i].city;
                        var storeAddress = stores[i].address;
                        var storeDistance = stores[i].distance;
                        var storeRetailer = stores[i].retailer;
                        //add the store information into the HTML id JSON
                        var names = $("<div>").append(
                            $('<p>').text(storeRetailer),
                            $('<p>').text(storeAddress),
                            $('<p>').text(storeCity + ", "),
                            $('<p>').text(Math.floor(storeDistance) + " Miles Away")
                        )
                        $('#JSON').append(names);

                        var marker = new google.maps.Marker({ position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) }, map: map });

                        markers.push(marker);

                        marker.info = new google.maps.InfoWindow({
                            content: '<span>' + storesName + '<br>' + storesAddress + '<br>' + storesCity + '<br>' + storesZip + '<br>' + storesProducts + '</span>'
                        });

                        marker.addListener('click', function () {
                            console.log("marker was pressed");
                            marker.info.open(map, marker)
                        });
                    };

                });
            };
            storeMarkers();
        });

    };

    // removes markers after submitting new search
    function removeMarkers() {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };
};


