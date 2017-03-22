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
