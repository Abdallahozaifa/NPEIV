/*global $*/

// TODO
$(document).ready(function() {
    // Get Navigation Bar
    $.get('/get/navigation/main', function(data) {
        $('#navigator_holder').html(data);
        reinstanceNav();
        if (sessionStorage.getItem('username')) {
            getMemberNav();
            getAdminNav();
        }
    });


});

// Resets the onClick listeners for the navigation accordian
function reinstanceNav() {
    $('.pageGroup-name').unbind('click');
    $('.pageGroup-name').click(function(e) {
        e.preventDefault();

        var $this = $(this);

        if ($this.next().hasClass('show-nav-element')) {
            $this.next().removeClass('show-nav-element');
            $this.next().slideUp(100);
        }
        else {
            //$this.parent().parent().find('li .pageGroup-children').removeClass('show-navbuild');
            //$this.parent().parent().find('li .pageGroup-children').slideUp(100);
            $this.next().toggleClass('show-nav-element');
            $this.next().slideToggle(100);
        }
    });
}

//
function toggleNavigator() {
    $('#navigator_holder').toggleClass('navigator_holder--hidden');
}

function getMemberNav() {
    /*$.get('/get/navigation/admin',function(data){
        $('#nav-root').append(data);
    });*/
}

function getAdminNav() {
    $.get('/get/navigation/admin', function(data) {
        $('#nav-root').append(data);
        reinstanceNav();
    });
}


function loadEditor() {
    $.get('/admin/editor', function(data) {
        $('body').append(data);
        console.log();
    });
}

// Dynamicaly load javascript form server
function loadScript(path, callback) {
    $.getScript(path, function(data) {
        callback(data);
    });
}


function search_bar() {
    
    var a = document.getElementById('f_search_bar');
    a.addEventListener('submit',function(e) {
        e.preventDefault();
        var b = document.getElementById('searchBar').value;
        window.location.href = 'https://npeiv-webapp-abdallahozaifa.c9users.io/#q='+ b + "&*";
    });
    
}