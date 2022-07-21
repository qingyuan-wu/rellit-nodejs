async function initMap() {
    let center = { lat: 43.5, lng: -79.4 };
    fetch('/my-location')
        .then(response => response.json)
        .then(location => {
            console.log(location.lat);
            if (parseFloat(location.lat) !== -1 || parseFloat(location.long) !== -1) {
                // location is available
                center = { lat: parseFloat(location.lat), lng: parseFloat(location.long) };
            }
        });
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: center,
            gestureHandling: "greedy",
        });

    fetch('/questions')
        .then(response => response.json())
        .then(questions => {
            for (const question of questions) {
                if(typeof question.lat === "string" && typeof question.long === "string") {
                    const marker = new google.maps.Marker({
                        position: { lat: parseFloat(question.lat), lng: parseFloat(question.long) },
                        map,
                        url: `/?question=${question.questionId}`,
                        title: question.text,
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        window.location.href = marker.url;
                    });
                }
            }
        });

    // const mapCentre = map.getCenter();

    // //Set local storage variables.
    // localStorage.mapLat = mapCentre.lat();
    // localStorage.mapLng = mapCentre.lng();
    // localStorage.mapZoom = map.getZoom();

    // google.maps.event.addListener(map,"center_changed", function() {
    //     //Set local storage variables.
    //     mapCentre = map.getCenter();

    //     localStorage.mapLat = mapCentre.lat();
    //     localStorage.mapLng = mapCentre.lng();
    //     localStorage.mapZoom = map.getZoom();    
    // });

    // google.maps.event.addListener(map,"zoom_changed", function() {
    //     //Set local storage variables.
    //     mapCentre = map.getCenter();

    //     localStorage.mapLat = mapCentre.lat();
    //     localStorage.mapLng = mapCentre.lng();
    //     localStorage.mapZoom = map.getZoom();     
    // });
}

window.initMap = initMap;