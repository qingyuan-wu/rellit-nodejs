const geolocation = require('geolocation')

const c = () => {
    // // Executes after successful getCurrentPosition() call
    // function success(position) {
    //     const latitude  = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     return [ latitude, longitude ];
    // }
    // // Informs user that their location cannot be determined
    // function error() {
    //     console.log("could not determine your location");
    //     return [ -1, -1 ];
    // }

    geolocation.getCurrentPosition((err, position) => {
        if (err) throw err;
        console.log(position);
    });
    return 5;
};

module.exports = { c };