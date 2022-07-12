function handleCredentialResponse(res) {
    const resJson = jwt_decode(res.credential);

    document.getElementById("custom-greeting").innerHTML = `Hello ${resJson.given_name}!`;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(resJson));
}