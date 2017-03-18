/* IMPORTS */
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const randomString = require("randomstring"); // Random string genorator for temporory key genoration
const crypto = require('crypto');


// Setting up app, to user body parser for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Server consts
const root = __dirname;

// Custom Server Modules
var DataStoreGate = require('./server_modules/DataStoreGate.js')(); // The comm. port to the datastore

var Email = require('./server_modules/Email.js')(); // TODO

var Navigation = require('./server_modules/navigation.js')(app, DataStoreGate); // Start dynamic navigation module

var Authentication = require('./server_modules/authentication.js')(app, DataStoreGate, crypto, randomString); // Module for user login and user authentication

var PageMgmt  = require('./server_modules/PageMgmt.js')( app, fs, Navigation, Authentication, DataStoreGate); // Module for page management

var UserMgmt  = require('./server_modules/UserMgmt.js')( randomString, app, Authentication, DataStoreGate, Email); // Module for user management

  
/**
 * --- THE  SERVER ---
 **/
 
 
/* Serving static files using express */
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

/* GET HOMEPAGE */
app.get('/', function(req, res) {
    res.sendFile(root + '/index.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/* GET PUBLIC PAGES */
app.get('/public/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/* GET MEMBER PAGES */
app.get('/member/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/* GET ADMIN PAGES */
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



