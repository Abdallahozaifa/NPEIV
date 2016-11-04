// flexO.js

/*global jQuery*/

(function($) {
    // Called for the parnet object
    $.fn.flexO = function(_options, _child_properties) {
        var this_ = this; // To keep track of the flexO object

        //// _options (object form)
        // flow : row | column  // direction of flow
        // wrap : true | false  // flow wrapping
        var options = _options;

        //// _child_properties (array of objects)
        // class : [class name]
        // basis : [value]      // basis width (defalut in px, accepts-> %)
        // grow : true | false
        // shrink : true | false
        var default_properties = {
            'class': '',
            'basis': '33%',
            'grow': true,
            'shrink': true
        };
        var children = []; // {DOM,properties} // Should be in order

        // Set children proporites
        this.calcFlex = function() {
            var parent_width = Math.floor($(this_).width());

            for (var _i = 0; _i < children.length; _i++) {
                var _horz_margin = $(children[_i].DOM).horizontalMargin();
                // if a percentage
                if (RegExp('/*%').test(children[_i].properties.basis)) {
                    var width_percentage = Number(children[_i].properties.basis.replace('%', '') / 100.0);
                    $(children[_i].DOM).width(Math.floor(parent_width * width_percentage - _horz_margin));

                }
                // Assumed pxv
                else {
                    var width_pixels = Number(children[_i].properties.basis);
                    $(children[_i].DOM).width(width_pixels - _horz_margin);
                }

                console.log($(children[_i].DOM).offset().left > parent_width / 2);
                

            }


            //RegExp('/*%').test( position.left
            //$(this).width(Math.floor($(this_).width() / 2.1));
        };



        // When the flexO object is resized
        $(window).resize(this.calcFlex);

        function init() {
            // Set mandatory CSS of Children
            $(this_).children().css({
                'position': 'relative',
                'display': 'inline-block',
                'vertical-align': 'top'
            });

            var _temp_children = $(this_).children();

            for (var _i = 0; _i < _temp_children.length; _i++) {

                var _temp_properties = default_properties;
                for (var _i2 = 0; _i2 < _child_properties.length; _i2++) {

                    if ($(_temp_children[_i]).hasClass(_child_properties[_i2].class)) {
                        _temp_properties = _child_properties[_i2];
                    }
                }

                children.push({
                    'DOM': _temp_children[_i],
                    'properties': _temp_properties
                });

            }

        }

        init();
        this_.calcFlex();
        return this;
    };

    $.fn.horizontalMargin = function() {
        return Number($(this).css('margin-left').replace('px', '')) + Number($(this).css('margin-right').replace('px', ''));
    };

}(jQuery));

/* ARK 

*/
