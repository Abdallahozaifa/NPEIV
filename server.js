/* IMPORTS */
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");

var DataStoreGate = require('./server_modules/DataStoreGate.js');

/* SERVER */
const root = __dirname;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

/* Listens on the Server Port */
const server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    if (process.env.PORT) {
        console.log("https://npeiv-webapp-abdallahozaifa.c9users.io/");
    }
    else {
        console.log('App listening at http://%s:%s', server.address().address, server.address().port);
    }
});



require('./server_modules/navigation.js')(app); // Start dynamic navigation
