var map;
var markers = [];
var infoWindow;
var label = 1;


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
    // autocomplete function end

    document.getElementById('locate-button').addEventListener('click', function (event) {
        event.preventDefault();
        // removes markers after submitting new search
        removeMarkers();
        // empties location list after submitting new search
        clearList();
        geocodeAddress(geocoder, map);

    });

    // allows pressing "Enter" key to submit form
    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 13) {
            // Simulate clicking on the submit button.
            document.getElementById('locate-button').click();
        }
    });

    // stores new Geocoder object into a variable
    var geocoder = new google.maps.Geocoder();

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

                    var data = JSON.parse(response);
                    console.log(data);
                    var stores = data.stores;

                    for (var i = 0; i < stores.length; i++) {

                        var storesLat = stores[i].lat;
                        var storesLng = stores[i].lng;
                        var storeCity = stores[i].city;
                        var storeState = stores[i].state;
                        var storeState = stores[i].state;
                        var storeZip = stores[i].zip;
                        var storeAddress = stores[i].address;
                        var storeDistance = stores[i].distance;
                        var storeRetailer = stores[i].retailer;
                        //begin lodash
                        var retailerName = _.find(data.retailers, { id: storeRetailer });
                        var retailDisplay = retailerName.name;

                        var storeProductIDs = JSON.parse(data.stores[i].products) || [];
                        // || to ensure code doesn't break, set [];
                        var storeRetailer = data.stores[i].retailer;
                        // turn string array to JS array, get product details, then create HTML string for info window
                        var productHTML = storeProductIDs
                            .map(function (productId) {
                                return data.products
                                    .find(function (product) {
                                        return productId === product.id
                                    });
                            })
                            .reduce(function (result, p) { return result + p.title + '<br>'; }, '');

                        // content for infowindow
                        var directionsURL = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(address) + "/&destination=/" + encodeURIComponent(storeAddress) + "/%2C/" + encodeURIComponent(storeCity) + "/%2C/" + encodeURIComponent(storeState) + "/%2C/" + encodeURIComponent(storeZip);

                        //add the store information into the HTML id JSON
                        var names = $("<li>").append(
                            $('<p>').text(retailDisplay).attr("class", "retailers"),
                            $('<p>').html(storeAddress + "<br>" + storeCity + ", " + storeState + " " + storeZip),
                            $('<p>').html("Products: " + productHTML),
                            $('<p>').text(Math.floor(storeDistance) + " Miles Away"),
                            $('<p>').html('<a href=' + directionsURL + ' target="_blank">Directions to Store</a>'));

                        $('#JSON').append(names);


                        var contentString = '<span>' + retailDisplay + '<br>' + storeAddress + '<br>' + storeCity + ', ' + storeState + ' ' + storeZip + '<br>' + "Products: " + productHTML + '<br>' + '<a href=' + directionsURL + ' target="_blank">Directions to Store</a>' + '</span>'

                        var storeInfowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        // beginning of code to add number to marker
                        var marker = new google.maps.Marker({
                            position: { lat: parseFloat(storesLat), lng: parseFloat(storesLng) },
                            map: map,
                            info: contentString,
                            label: (i + 1).toString()
                        })

                        markers.push(marker);

                        // click event listener for marker infowindow. 
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

            map.setZoom(10);
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


