var NavigationObjects = require("./DataObjects/NavigationObject.js"); // Refrence for navigation objects

// Dynamic Navigation
module.exports = function(app, DatastoreGate) {

    /** POST - for obtaining the navigation object from the datastore
     * Paramaters: (all mandaotry unless otherwise)
     *  Response Structure: (JSON)
     *  Navicatoin object
     */
    app.post('/fetch/navigation/main', function(req, res) {
        res.send(JSON.stringify(main_navigation));
    });

    this.addPage = function(name, parent_string, callback) {
        // Get nav obj from datastore
        getNavObjFromDatastore(function(err, data) {
            // Find parent
            for (var i = 0; i < data.children.length; i++) {
                
            }
            
            // Add page to nav
            
            
            
            // callback(err, data)
        });

        
    }

    this.deletePage = function(name, callback) {
        // Get nav obj from datastore

        // Find and delete page from nav

        // callback(err, data)
    }

    this.addPageGroup = function(name, parent, callback) {
        // Get nav obj from datastore

        // Add page group to nav

        // callback(err, data)
    }

    this.deletePageGroup = function(name, callback) {
        // Get nav obj from datastore

        // Find and delte page group in nav - it has to be empty to delete

        // callback(err, data)
    }

    this.getAllPages = function(callback) {
        // Read all in '__dirname/html/Editables/' dir (excluding backup)
    }

    function getNavObjFromDatastore(callback) {
        DatastoreGate.getObjFromStore("NAV", "NAV", callback);
    }

    /**
     * 
     */
    function putNavObjToDatastor(obj, callback) {
        // Save new nav object
        DatastoreGate.updateObjFromStore("NAV", "NAV", obj, function(err, data) {
            if (!err) {
                // If no error from datastore
                callback(false);
            }
            else {
                // If error from datastore
                callback(err);
            }
        });
    }

    return this;
};


// Main Navigation (TODO -> PUT ON DATASTORE)
/* OLD nav object
var main_navigation = [
    new navItem('Home', '/', 'main', 'fa-home', []),
    new navItem('Help', '#', 'main', 'fa-heart', []),
    new navItem('About', '#', 'main', 'fa-info', [ 
        new navItem('Action Teams', '#', 'submain', 'fa-users', []),
        new navItem('Groups Involved', '/about/mission', 'submain', 'fa-book', [])
        ]),
    new navItem('Educate', '#', 'main', 'fa-graduation-cap', [
        new navItem('Campus Sexual Assalt', '#', 'submain', 'fa-ban', []),
        new navItem('Campus SA Victimization', '#', 'submain', 'fa-question', [])
        ]),
    new navItem('Publications', '#', 'main', 'fa-heart', [
        new navItem('National Plan', '#', 'submain', 'fa-pencil', []),
        new navItem('Press Releases', '#', 'submain', 'fa-microphone', []),
        new navItem('Think Tank Info', '#', 'submain', 'fa-lightbulb-o', []),
        new navItem('Newsletters', '#', 'submain', 'fa-newspaper-o', []),
        new navItem('Policy Statements', '#', 'submain', 'fa-graduation-cap', []),
        new navItem('By-Laws', '#', 'submain', 'fa-balance-scale', [])
        ]),
    new navItem('Events', '#', 'main', 'fa-calendar', [
        new navItem('Test', '#s', 'submain', 'fa-calendar', [])
        ]),
    new navItem('Contact', '#', 'main', 'fa-thumbs-o-up', [
        new navItem('Facebook', 'https://www.facebook.com/NPEIV/', 'submain', 'fa-facebook-official', []),
        new navItem('Twitter', 'https://twitter.com/NPEIV', 'submain', 'fa-twitter-square', []),
        new navItem('LinkedIn', 'https://www.linkedin.com/in/crystal-roman-97aa3a106', 'submain', 'fa-linkedin-square', []),
        new navItem('Contact Us', '#', 'submain', 'fa-phone-square', [])
        ]),
    new navItem('Join', '#', 'main', 'fa-users', []),
    new navItem('Login', '/public/login', 'main', 'fa-sign-in', []),
];*/

var main_navigation = [
    new navItem('Home', '/', 'main', 'fa-home', []),
    new navItem('Login', '/public/login', 'main', 'fa-sign-in', []),
    new navItem('User Mgmt', '/admin/userMgmt', 'main', 'fa-home', []),
    new navItem('Page Mgmt', '/admin/pageMgmt', 'main', 'fa-home', [])
];


// Navigation item object
function navItem(_name, _link, _class, _icon, _submenu) {
    this.name = _name;
    this.link = _link;
    this.class = _class;
    this.icon = _icon;
    this.submenu = _submenu;
    return this;
}
