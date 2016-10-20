/* IMPORTS */
const app = require('express')();
const fs = require('fs');
const bodyParser = require("body-parser");
const gcloud = require('gcloud');
const datastore = gcloud.datastore({
  //projectId: 'my-project',
  //keyFilename: '/path/to/keyfile.json'
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/*GET HOMEPAGE*/
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html', function (err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/*GET PUBLIC PAGE*/
app.get('/public/*', function(req, res) {
    res.sendFile(__dirname + '/html/' + req.path  + '.html', function (err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

/*GET MEMBER PAGE*/
app.get('/member/*', function(req, res) {
    res.sendFile(__dirname+ '/html/' + req.path  + '.html', function (err) {
        if (err) {
            res.status(err.status).end();
        }
    });
});

// Server Listen 
const port = process.env.PORT || 8080;
const ip = process.env.IP || "0.0.0.0";
app.listen(port, ip, function () {
    console.log('Server running on port : ' + port);
});