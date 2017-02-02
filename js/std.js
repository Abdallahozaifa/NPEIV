// Standard Page JavaScript
/*global $*/
var menu_icon;
var main_nav_menu;
var donate_button;

$(document).ready(init);

function init() { // Init Global Vars
    menu_icon = $('#dropdown_navigation_bar_icon')[0];
    main_nav_menu = $('.main_navigation_list')[0];
    donate_button = $('#paypal_icon')[0];

    // Donate button and link
    $(donate_button).click(function() {
        window.location.href = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=95JRBJS74QBJS';
    });



    //// Fetch Navigation Object from server
    $.post('/fetch/navigation/main', function(data) {
        //// Populate Navigation, w/ recursive algo

        data = JSON.parse(data);

        // Start w/ main nav. list from the menu icon who all inherit from .navigation_list
        function populateNavigation(clicky, parent, list, counter, parent_id) {
            // Each nav list is givin a unique id
            // Each Child has the class of their parnets id
            
            var nav_id = 'nav_menu_' + counter++;

            // Add nav list to parent
            $(parent).prepend("<nav id='" + nav_id + "' class='" + parent_id + " b_white c_dark' >");

            // Create new nav item list to the new nav list 
            $('#' + nav_id).append("<ul class='font_med ulNavigation '>");

            // Create on click listener for the navigation item
            $(clicky).on('click', function() {
                
                // If its submenue is not open, open it, and close its neighbors
                if ($('#' + nav_id)[0].classList.contains('navigation_list--active') == false) {
                    // Get neighbours, and close them
                    
                    //console.log( '.' + parent_id.replace(' ','.') );
                    var paren_class_list = parent_id;
                    paren_class_list ='.' +  paren_class_list.replace(' ','.')
                    console.log( paren_class_list);
                    
                    $(paren_class_list ).each(function(index) {
                       this.classList.remove('navigation_list--active');
                    });
                    //$('#' + nav_id).parent().add('navigation_list--active');
                    $('#' + nav_id)[0].classList. add('navigation_list--active');
                    
                    

                }
                else {
                    // If the submenye is open, close it and its children
                    $('#' + nav_id)[0].classList.remove('navigation_list--active');
                    
                    $('.' + nav_id).parent().children().each(function(index) {
                        this.classList.remove('navigation_list--active');
                    });

                }
            });

            // Submenue generation
            for (var x in list) {
                $('#' + nav_id + ' ul').append("<li class='navigation_item '><a href='" + list[x].link + "' class='navigation_link fa " + list[x].icon + " c_white'> <h5 class='font_small font_tight'>" + list[x].name + "</h5></a></li>");

                if (list[x].submenu.length > 0) {
                    //console.log($('#' + nav_id + ' ul li a').last()[0]);
                    populateNavigation($('#' + nav_id + ' ul li a').last()[0],  parent , list[x].submenu, (counter++) * 100, parent_id + ' ' + nav_id);
                }

            }

        }
        populateNavigation(menu_icon, $('#navigation_holder')[0], data, 0, 'navigation_list');

    });

    //// Temp demo layout and widgets
    //$('.body_prime').initLayout({'style' : '50_50'}, null);
    //$('.body_prime').initLayout({'style' : '100_0'}, null);
    //$('.body_prime').initLayout({'style' : '30_30_30'}, null);
    //$('#test_layout_123').addText('AaBbCc', 'Content', {}, null);
    //$('#test_layout_123').addText('</br>...</br>', 'More Content', {}, null);
   // $('#test_layout_456').addText('AaBbCc', 'Content', {}, null);
    //$('#test_layout_456').addText('</br>...</br>', 'More Content', {}, null);
}
