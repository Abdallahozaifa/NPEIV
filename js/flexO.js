// flexO.js

/*global jQuery*/

(function($) {

    $.fn.flexO = function(options) {
        //// options (object form)
        // flow : row | column  // direction of flow
        // wrap : true | false  // flow wrapping
        // basis : [value]      // basis width
        // grow : true | false
        // shrink : true | false
        //// options (array form)
        // [flow, wrap, basis, grow, shrink ]
        
        this.width = 0;
        


        return this.each(function() {
            function calc_resize() {
                
            }
            
            this.css({
                'diplay': 'inline-block',
                'vertical-align':'top'
            });
            
            this.parent().resize(calc_resize);
        });
    };

}(jQuery));
