/* IMPORTS */
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");

// Setting up app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Custom Server Modules
var DataStoreGate = require('./server_modules/DataStoreGate.js')(); 

var Email = require('./server_modules/Email.js'); // TODO

var Navigation = require('./server_modules/navigation.js')(app, DataStoreGate); // Start dynamic navigation module

var Authentication = require('./server_modules/authentication.js')(app, DataStoreGate); // Module for user login and user authentication

var PageMgmt  = require('./server_modules/PageMgmt.js')( app, fs, Navigation, Authentication); // Module for page management

var UserMgmt  = require('./server_modules/UserMgmt.js')( app, Authentication, DataStoreGate); // Module for user management

  
/**
 * SERVER 
 */
const root = __dirname;



/* Serving static files in express */
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

/*GET HOMEPAGE*/
app.get('/', function(req, res) {
    res.sendFile(root + '/index.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/*GET PUBLIC PAGE*/
app.get('/public/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/*GET MEMBER PAGE*/
app.get('/member/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/*GET ADMIN PAGE*/
app.get('/admin/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/* Listens on the Server Port */
const server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    if (process.env.PORT) {
        console.log("https://npeiv-webapp-abdallahozaifa.c9users.io/");
    }
    else {
        console.log('App listening at http://%s:%s', server.address().address, server.address().port);
    }
});



