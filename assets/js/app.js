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

    // user location detection function begin
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
    // user location detection function end

    // Autocomplete function begin
    var input = document.getElementById('location-input');

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
    });

    // stores new Geocoder object into a variable
    var geocoder = new google.maps.Geocoder();

    document.getElementById('locate-button').addEventListener('click', function (event) {
        // Needs to be merged with master
        event.preventDefault();
        // removes markers after submitting new search
        removeMarkers();
        clearList();
        geocodeAddress(geocoder, map);
    });
    // autocomplete function end

    // search addresses/locations function begin
    function geocodeAddress(geocoder, resultsMap) {

        var address = document.getElementById('location-input').value;

        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);

                // places a custom marker at user input location
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                });

                markers.push(marker);

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            };

            // Query parameters for pulling store locator API
            var key = "dmhfc3RvcmVsb2NhdG9yLXYxeyJjaWQiOjJ9";
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var distance = document.getElementById('miles-input').value;
            var queryURL = "https://storelocator.velvethammerbranding.com/api/v1/" + key + "/get-stores/" + latitude + "/" + longitude + "/" + distance;

            // display markers function for nearby store locations relative to searched location. Begin storeMarker function
            function storeMarkers() {
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {

                    //storing api response into object
                    var JSONObject = JSON.parse(response);

                    var products = JSONObject.products;
                    var retailers = JSONObject.retailers;
                    var stores = JSONObject.stores;

                    for (var i = 0; i < stores.length; i++) {

                        var storesLat = stores[i].lat;
                        var storesLng = stores[i].lng;
                        var storeCity = stores[i].city;
                        var storeState = stores[i].state;
                        var storeZip = stores[i].zip;
                        var storeAddress = stores[i].address;
                        var storeDistance = stores[i].distance;
                        var storeRetailer = stores[i].retailer;
                        //using lodash to display the retailer
                        var retailerName = _.find(JSONObject.retailers, { id: storeRetailer });
                        console.log("Retailer name(s)" + retailerName)
                        var storeProducts = stores[i].products;

                        var productName = "";

                        // placeholder/workaround for showing product name until we figure out lodash
                        if (storeProducts === "[1]") {
                            productName = products[0].title;
                        } else if (storeProducts === "[2]") {
                            productName = products[1].title
                        } else if (storeProducts === "[2,1]") {
                            productName = products[0].title + " & " + products[1].title
                        } else if (storeProducts === "[1,2]") {
                            productName = products[0].title + " & " + products[1].title
                        };

                        //add the store information into the HTML id JSON
                        var names = $("<div>").append(
                            $('<p>').text(retailerName.name),
                            $('<p>').text(storeAddress),
                            $('<p>').text(storeCity + ", " + storeState + " " + storeZip),
                            $('<p>').text("Products: " + productName),
                            $('<p>').text(Math.floor(storeDistance) + " Miles Away")
                        );
                        $('#JSON').append(names);

                        // content for infowindow
                        var contentString = '<span>' + retailerName + '<br>' + storeAddress + '<br>' + storeCity + ', ' + storeState + ' ' + storeZip + '<br>' + "Products: " + productName + '</span>';

                        var storeInfowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        var marker = new google.maps.Marker({ position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) }, map: map, info: contentString });

                        markers.push(marker);

                        // click event listener for marker infowindow. Maybe do hover instead of click
                        marker.addListener('click', function () {
                            storeInfowindow.setContent(this.info);
                            storeInfowindow.open(map, this);
                        });

                    };
                    // storeMarker function end

                });
            };
            storeMarkers();

            // clears input text boxes after search is submitted
            $("#location-input").val("");
            $("#miles-input").val("");
        });

    };
    // search addresses/locations function end

    // removes markers after submitting new search
    function removeMarkers() {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };
    function clearList() {
        $('#JSON').html("")
    }
};


