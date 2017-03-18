// tryHard.js

/* Pre-Reqs.
    ->Bootstrap .css and .js
    ->Style script for augmenting layout
*/

/*global jQuery*/
// Jqurey libaray for page layout and layout widgets
(function($) {

    // Appends layout to parent element
    $.fn.initLayout = function(options, callback) {
        //// Prefab Styles
        // 100% width style, name: 100_0
        const _100_0 = "<div class='row layout_row'><div class='layout col-sm-12 '><div class='layout_inner' ></div></div></div>";
        // 50/50 collumn style, name: 50_50
        const _50_50 = "<div class='row layout_row'><div class='layout col-sm-6 '><div class='layout_inner' ></div></div><div class='layout col-sm-6 '><div class='layout_inner' ></div></div></div>";
        // 70/30 collumn style name: 70_30
        const _70_30 = "<div class='row layout_row'><div class='layout col-md-8 '><div class='layout_inner' ></div></div><div class='layout col-md-4 '><div class='layout_inner' ></div></div></div>";
        // 730_30_30 collumn style name: 30_30_30
        const _30_30_30 = "<div class='row layout_row'><div class='layout col-sm-4 '> <div class='layout_inner'></div></div><div class='layout col-sm-4 '><div class='layout_inner'></div> </div><div class='layout col-sm-4 '><div class='layout_inner'></div> </div></div>";



        var style = '50_50'; // Default Style
        try {
            style = options.style; // Get input style from options
        }
        catch (err) {
            console.warn("qLayout.js: error in parsing options")
        }
        // Select variable that corecponds to desired style
        if (style == '100_0') {
            this.append(_100_0);
        }
        else if (style == '50_50') {
            this.append(_50_50);
        }
        else if (style == '70_30') {
            this.append(_70_30);
        }
        else if (style == '30_30_30') {
            this.append(_30_30_30);
        }
        else {
            // Error if input style does not corespond with existing style
            console.error("qLayout.jquery.js: invalid layot style");
        }
        this.parent().addClass("container-fluid");
    
        // If there is a callback, call it
        if (callback != null) {
            callback();
        }
    };
    
    // Appends a text widget in to the layout
    $.fn.addText = function(callback) {
        // Prefab template for text widget
        var _text_widget = "<div class='text_widget'><div class='text_widget_content'><p class='text_widget_content'>Text</p></div></div>";
        $(this).append(_text_widget) // Append widget to layout
        
        // If there is a callback, call it
        if (callback != null) {
            callback();
        }
        return null;// Return the new element
    };
    
    
    // Appends a text widget in to the layout
    $.fn.startPageEditor = function() {
        
    };
    
    // Appends a text widget in to the layout
    $.fn.finalizePageEditor = function() {
        
    };
    
    //!! TODO -> vents_widget (a specail oList)

}(jQuery));

/* ARK 

*/
