// tryHard.js

/* Pre-Reqs.
    ->Bootstrap .css and .js
    ->Style script for augmenting layout
*/

/*global jQuery*/

(function($) {
    // 100% width style, name: 100_0
    const _100_0 = "<div class='row layout_row'><div class='layout col-sm-12 '><div class='layout_inner' ></div></div></div>";
    // 50/50 collumn style, name: 50_50
    const _50_50 = "<div class='row layout_row'><div class='layout col-sm-6 '><div class='layout_inner' ></div></div><div class='layout col-sm-6 '><div class='layout_inner' ></div></div></div>";
    // 70/30 collumn style name: 70_30
    const _70_30 = "<div class='row layout_row'><div class='layout col-md-8 '><div class='layout_inner' ></div></div><div class='layout col-md-4 '><div class='layout_inner' ></div></div></div>";
    // 730_30_30 collumn style name: 30_30_30
    const _30_30_30 = "<div class='row layout_row'><div class='layout col-sm-4 '> <div class='layout_inner'></div></div><div class='layout col-sm-4 '><div class='layout_inner'></div> </div><div class='layout col-sm-4 '><div class='layout_inner'></div> </div></div>";
    
    // Appends layout to parent element
    $.fn.initLayout = function(options, callback) {
        var style = '50_50';
        try {
            style = options.style;
        } catch (err){
            console.warn("tryHard.js: error in parsing options")
        }
        if (style == '100_0') {
            this.append(_100_0);
        } else if (style == '50_50') {
            this.append(_50_50);
        } else if (style == '70_30') {
            this.append(_70_30);
        } else if (style == '30_30_30') {
            this.append(_30_30_30);
        } else {
            console.error("tryHard.js: invalid layot style");
        }
        this.parent().addClass("container-fluid");
        
        if (callback!=null){
            callback();
        }
    };
    
    
    
    // Appends a text widget to the layout
    $.fn.addText = function(text, heading, options, callback) {
        var _text_widget = "<div class='text_widget'><h2>"+heading+"</h2><p>"+text+"</p></div>";
        this.append(_text_widget);
        
        
        if (callback!=null){
            callback();
        }
        return this;
    };
    
    //!! TO DO -> text_widget, image_widget, ulist_widget, olist_widget, events_widget (a specail oList)

}(jQuery));

/* ARK 

*/
