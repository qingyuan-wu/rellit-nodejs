function handleCredentialResponse(res) {
    navigator.geolocation.getCurrentPosition(position => {
        let resJson = jwt_decode(res.credential);
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        resJson.long = longitude;
        resJson.lat = latitude;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/start-session", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(resJson));

        window.location.reload()
    })
}

function getCoordinates() {

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        return { lat: latitude, long: longitude };
    }
    // Informs user that their location cannot be determined
    function error() {
        return { lat: -1, long: -1 };
    }
    // Attempts to get the position only if supported by browser
    if(!navigator.geolocation) {
        container.textContent = 'Geolocation is not supported by your browser';
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}