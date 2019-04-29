function initMap() {
    var options = {
        zoom: 10,
        center: { lat: 34.0522, lng: -118.2437 }
    };
    // var map = new google.maps.Map($('#map'), options);
    //issues with using map api & jquery...
    var map = new google.maps.Map(document.getElementById('map'), options);

    var marker = [
        {
            coords: { lat: 34.0522, lng: -118.2437 },
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h3> Store Location Information Here</h3>'
        },
        {
            coords: { lat: 34.0689, lng: -118.4452 },
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
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
