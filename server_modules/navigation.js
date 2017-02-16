// Dynamic Navigation
module.exports = function(app, DatastoreGate) {
    
    /** POST - for obtaining the navigation object from the datastore
     * Paramaters: (all mandaotry unless otherwise)
     *  Response Structure: (JSON)
     *      Navicatoin object
     */
    app.post('/fetch/navigation/main', function(req, res) {
        res.send(JSON.stringify(main_navigation));
    });

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
