/* LOGIN COMPONENETS */
var usrName = $("#username");
var pswd = ("#pswd");
var submitBtn = $(".loginBtnr");

function UserLogin() {
    $.post("/post/login?username=" + $('#user_name').val() + "&password=" + $('#pswd').val(), function(data) {
        console.log(data);
    });
}

submitBtn.click(function(){
    UserLogin();
});

/*
CLIENTID: 55924514143-n0kt131c6j39u29fljs67p0h5t1qeqdo.apps.googleusercontent.com
*/