// Dynamic Navigation
module.exports = function(app) {
    app.post('/fetch/navigation/main', function(req, res) {
        res.send(JSON.stringify(main_navigation));
    });

}


// Main Navigation
var main_navigation = [
    new navItem('Home', '/', 'fa-home', []),
    new navItem('Help', '/help', 'fa-heart', []),
    new navItem('About', '#', 'fa-book', [ 
        new navItem('Org.', '#', 'fa-book', [
                new navItem('Members', '/about/org/members', 'fa-book', [])
            ]),
        new navItem('Mission', '/about/mission', 'fa-book', [])
        ]),
    new navItem('Events', '#', 'fa-calendar', [
        new navItem('Test', '#s', 'fa-calendar', [])
        ]),
    new navItem('Contact', '/contact', 'fa-thumbs-o-up', []),
    new navItem('Donate', '/donate', 'fa-paypal', []),
    new navItem('Join', '/join', 'fa-users', []),
    new navItem('Login', '/login', 'fa-sign-in', []),
];


//
function navItem(_name, _link, _icon, _submenu) {
    this.name = _name;
    this.link = _link;
    this.icon = _icon;
    this.submenu = _submenu;
    return this;
}
