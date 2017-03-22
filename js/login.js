/*global $*/
/* LOGIN COMPONENETS */
var usrName = $("#username");
var pswd = ("#pswd");
var submitBtn = $(".loginBtnr");
var googleBtn = $(".g-signin");

$(document).ready(function() {
    try {
        // Check that the users temp key ttl is not expired
        if (sessionStorage.getItem("loginTTL") > Date.now()) {
            // Redirect to user page 
            window.location.href = "/member/user";
        }
    }
    catch (e) {
        // Ignore
    }

});

function UserLogin() {
    $.post("/post/login?username=" + $('#user_name').val() + "&password=" + $('#pswd').val(), function(data) {
        //console.log(data);
        data = JSON.parse(data);
        console.log(data);
        // If loging was a success
        if (data.Result == "OK") {
            var usrName = $('#user_name').val();

            // Store the users temp data into sessionStorage
            sessionStorage.setItem("username", usrName);
            sessionStorage.setItem("guid", data.key);
            sessionStorage.setItem("loginTTL", data.ttl);

            // Redirect to user page 
            window.location.href = "/member/user";
        }
        else {
            console.log(data.Result + data.Message); // Display login failure
            swal(
                'Oops...',
                'Username and Password do NOT match!',
                'error'
            )

        }

    });
}

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
