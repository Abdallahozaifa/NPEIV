// Dynamic Navigation
module.exports = function(app) {
    app.post('/fetch/navigation/main', function(req, res) {
        res.send(JSON.stringify(main_navigation));
    });

}


// Main Navigation
var main_navigation = [
    new navItem('Home', '/', 'fa-home', []),
    new navItem('Help', '#', 'fa-heart', []),
    new navItem('About', '#', 'fa-book', [ 
        new navItem('Action Teams', '#', 'fa-users', []),
        new navItem('Groups Involved', '/about/mission', 'fa-book', [])
        ]),
    new navItem('Educate', '#', 'fa-graduation-cap', []),
    new navItem('Events', '#', 'fa-calendar', [
        new navItem('Test', '#s', 'fa-calendar', [])
        ]),
    new navItem('Contact', '#', 'fa-thumbs-o-up', [
        new navItem('Facebook', 'https://www.facebook.com/NPEIV/', 'fa-facebook-official', []),
        new navItem('Twitter', 'https://twitter.com/NPEIV', 'fa-twitter-square', []),
        new navItem('LinkedIn', 'https://www.linkedin.com/in/crystal-roman-97aa3a106', 'fa-linkedin-square', []),
        new navItem('Contact Us', '#', 'fa-phone-square', [])
        ]),
    new navItem('Join', '#', 'fa-users', []),
    new navItem('Login', '#', 'fa-sign-in', []),
];


//
function navItem(_name, _link, _icon, _submenu) {
    this.name = _name;
    this.link = _link;
    this.icon = _icon;
    this.submenu = _submenu;
    return this;
}
