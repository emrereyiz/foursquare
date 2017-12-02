function initMap(mapData) {

    // latitude and longitude control
    if (mapData[0] != undefined) {
        centerVal = {
            lat: mapData[0].lat,
            lng: mapData[0].lng
        } // return dynamic last values
    } else {
        centerVal = {
            lat: 35.8985529550346,
            lng: 14.513170926723317
        }; // return static values
    }

    // create map object and set property
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: centerVal,
        scrollwheel: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        zoomControl: true,
    });

    // array for map icon
    var data = [];
    // each get and set property
    $.each(mapData, function(index, item) {
        var lat = item.lat,
            lng = item.lng,
            title = item.name
        data.push({
            lat: lat,
            lng: lng,
            title: title
        });
    });
    // info window set property
    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 350,
        shadow: 'none'
    });

    // each and set position
    for (var i = 0; i < data.length; ++i) {
        var marker = new google.maps.Marker({
            position: {
                lat: data[i].lat,
                lng: data[i].lng
            },
            map: map,
            icon: "_assets/img/ico-map.png",
            title: data[i].title
        });

        bindInfoWindow(marker, map, infoWindow, data[i].title);
    }

    function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
        });
    }
}