/*global $*/
/* LOGIN COMPONENETS */
var usrName = $("#username");
var pswd = ("#pswd");
var submitBtn = $("#loginButton");
var googleBtn = $(".g-signin");





function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

submitBtn.click(function() {
    UserLogin();
});

googleBtn.click(function() {
    onSignIn();
});
/*
CLIENTID: 55924514143-n0kt131c6j39u29fljs67p0h5t1qeqdo.apps.googleusercontent.com
ClIENT SECRET: K8mCutIVhKo3fmepxEJSF3Pk
*/
