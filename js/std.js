// Standard Page JavaScript
/*global $*/
var menu_icon;
var main_nav_menu;

$(document).ready(init);

function init() { // Init Global Vars
    menu_icon = $('#dropdown_navigation_bar_icon')[0];
    main_nav_menu = $('.main_navigation_list')[0];

    //// Fetch Navigation
    $.post('/fetch/navigation/main', function(data) {
        //// Populate Navigation, w/ recursive algo
        
        data = JSON.parse(data);
        
        populateNavigation(menu_icon, $('#navigation_holder')[0], data, 0, 'navigation_list'); // Start w/ main nav. list from the menu icon who all inheri from .navigation_list
        function populateNavigation(clicky, parent, list, counter, parent_id) {
            var nav_id = 'nav_menu_' + counter++;
            $(parent).prepend("<nav id='" + nav_id + "' class='"+parent_id+" b_dark' >");
            $('#' + nav_id).append("<ul class='font_med'>");

            $(clicky).on('click', function() {
                if( $('#' + nav_id )[0].classList.toggle('navigation_list--active') == true ){
                    // Close neighbors, when list is oppened
                    // !! TO DO
                    //$(parent).each(function(index){ this.classList.remove('navigation_list--active'); });
                    
                    
                } else {
                    // Close all children, when the root is closed
                    $('.' + nav_id).each(function(index){ this.classList.remove('navigation_list--active'); });
                    
                }
            });

            for (var x in list) {
                $('#' + nav_id + ' ul').append("<li class='navigation_item '><a href='" + list[x].link + "' class='navigation_link fa " + list[x].icon + " c_white'> <h5 class='font_small font_tight'>" + list[x].name + "</h5></a></li>");
                
                if (list[x].submenu.length > 0) {
                    //console.log($('#' + nav_id + ' ul li a').last()[0]);
                    populateNavigation($('#' + nav_id + ' ul li a').last()[0], parent, list[x].submenu, (counter++) * 100,parent_id + ' ' + nav_id);
                }
                
            }

        }
        
    });

    ////
    $('#test_flexO').flexO({}, {});

}
