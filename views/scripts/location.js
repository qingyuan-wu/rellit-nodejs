
function displayCoordinates() {
    const container = document.getElementById('location-container');
    // Executes after successful getCurrentPosition() call
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        container.innerHTML = latitude + ", " + longitude;
    }
    // Informs user that their location cannot be determined
    function error() {
        container.innerHTML = 'Unable to retrieve your location';
    }
    // Attempts to get the position only if supported by browser
    if(!navigator.geolocation) {
        container.textContent = 'Geolocation is not supported by your browser';
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

// Places the user's coordinates in the Users table
function getCoordinates() {
    // Executes after successful getCurrentPosition() call
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        return [ latitude, longitude ];
    }
    // Informs user that their location cannot be determined
    function error() {
        console.log("could not determine your location");
        return [ -1, -1 ]
    }
    // Attempts to get the position only if supported by browser
    if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}