/* IMPORTS */
const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const fs = require('fs');
const randomString = require("randomstring"); // Random string genorator for temporory key genoration
const crypto = require('crypto');

// Setting up app, to user body parser for POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Server consts
const root = __dirname;

// Custom Server Modules
var DataStoreGate = require('./server_modules/DataStoreGate.js')(); // The comm. port to the datastore

var Email = require('./server_modules/Email.js')(); // TODO

var Navigation = require('./server_modules/navigation.js')(fs, app, DataStoreGate, root); // Start dynamic navigation module

var Authentication = require('./server_modules/authentication.js')(app, DataStoreGate, crypto, randomString); // Module for user login and user authentication

var PageMgmt = require('./server_modules/PageMgmt.js')(app, fs, Navigation, Authentication, DataStoreGate, root); // Module for page management

var UserMgmt = require('./server_modules/UserMgmt.js')(randomString, app, Authentication, DataStoreGate, Email); // Module for user management

var Calendar = require('./server_modules/calendar.js')(root);

var Event = require('./server_modules/events.js')(app, Authentication, DataStoreGate, Calendar); // Module for events

var Comm = require('./server_modules/comm.js')(app, Authentication, DataStoreGate, Email); // Module for communication

var glob = require("glob");
/**
 * --- THE  SERVER ---
 **/


/* Serving static files using express */
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use('/files', express.static('files'));
app.use('/node_modules', express.static('node_modules'));
app.use('/calendar.html', express.static('calendar.html'));
app.use(express.static('node_modules/fullcalendar'));

var actTeamHTML = ""; // 
var calHTML = ""; //
var contactHTML = ""; //
var infoHTML = ""; //
var memberHTML = ""; //
var indexHTML = ""; //
var planHTML = ""; //
var policyHTML = "";

var getDirectories = function(src, callback) {
    glob(src + '/**/*', callback);
};

app.post('/search', function(req, res) {
    var searchStr = req.body.searchWord;
    // console.log(searchStr);
    var listofFiles = [];
    var initRes = res;
    getDirectories(root + '/html/pub', function(err, res) {
        if (err) {
            console.log('Error', err);
        }
        else {
            //console.log(res);
            var filesRead = res.length;
            var curFile = "";
            res.forEach(function(file) {
                //onsole.log(res[i]);
                curFile = file.substr(file.lastIndexOf('/') + 1);
                // console.log("------File Name------");
                // console.log(curFile);
                fs.readFile(file, 'utf8', function(err, data) {
                    filesRead--;
                    // console.log("Reading %s...", file);
                    if(data.includes(searchStr)){
                        // console.log("Found in File: " + file);
                        listofFiles.push(file);
                    }
                    if (err) {
                        return console.log(err);
                    }
                    if (filesRead == 0) {
                        initRes.send(JSON.stringify(listofFiles));
                    }
                });
            });
        }
    });
});




/* GET HOMEPAGE */
app.get('/', function(req, res) {
    res.sendFile(root + '/html/index.html', function(err) {
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

app.get('/pub/*', function(req, res) {
    res.sendFile(root + '/html/' + req.path + '.html', function(err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

app.get('/nav/*', function(req, res) {
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
