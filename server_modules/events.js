/*
 *  Authentication server module
 *  @param{app}             - Instance of express
    @param{authentication}  - Instance of randomstring
 *  @param{datastore}       - Instance of the google datastore connection
 *  
 *  @return                 - Itself
 */
module.exports = function(app, Authentication, DataStoreGate, Calendar) {

    // Build for jQuery Jtable
    app.post('/post/eventMgmt/getAllPending', function(req, res) {
        // Extracet post data
        var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];

        // Auth. user
        Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
            if (valid) {

                getAllPendingEvents(function(err, data) {
                    if (!err) {

                        // Send back OK, with all user objects
                        res.send(JSON.stringify({
                            Result: "OK",
                            Records: data
                        }));

                    }
                    else {
                        res.send(JSON.stringify({
                            Result: "ERROR",
                            Message: err
                        }));

                    }
                });
            }
            else {
                // Send error, authentication failed
                res.send(JSON.stringify({
                    Result: "ERROR",
                    Message: "Authentication Fail"
                }));
            }
        });
    });

    // Build for jQuery Jtable
    app.post('/post/eventMgmt/addPending', function(req, res) {
        // Extracet post data
        var username = req.query['username'] || req.body['username'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var data = {
            ident: req.body['ident'] || req.body['ident'],
            name: req.body['name'] || req.query['name'],
            description: req.body['description'] || req.query['description'],
            date: req.body['date'] || req.query['date'],
            time1: req.body['time1'] || req.query['time1'],
            time2: req.body['time2'] || req.query['time2'],
            location: req.body['location'] || req.query['location']
        };

        // Auth. user
        Authentication.authenticateUser(username, tempkey, function(valid) {
            if (valid) {
                createPendingEvent(data, function(err, data) {
                    if (!err) {
                        // Send back OK, with all user objects
                        res.send(JSON.stringify({
                            Result: "OK",
                            Record: data
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            Result: "ERROR",
                            Message: err
                        }));
                    }
                });
            }
            else {
                // Send error, authentication failed
                res.send(JSON.stringify({
                    Result: "ERROR",
                    Message: "Authentication Fail"
                }));
            }
        });
    });
    
    // Build for jQuery Jtable
    app.post('/post/eventMgmt/deletingPending', function(req, res) {
        // Extracet post data
        var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var ident = req.query['ident'] || req.body['ident'];
        
        // Auth. user
        Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
            if (valid) {
                deletePendingEvent(ident, function(err) {
                    if (!err) {
                        // Send back OK, with all user objects
                        res.send(JSON.stringify({
                            Result: "OK"
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            Result: "ERROR",
                            Message: err
                        }));
                    }
                });
            }
            else {
                // Send error, authentication failed
                res.send(JSON.stringify({
                    Result: "ERROR",
                    Message: "Authentication Fail"
                }));
            }
        });
    });
    
    
    app.post('/post/eventMgmt/AuthEvent', function(req, res) {
        // Extracet post data
        var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var data = req.query['data'] || req.body['data'];
        
        // Auth. user
        Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
            if (valid) {
                authorizeEvent(data, function(err) {
                    if (!err) {
                        // Send back OK, with all user objects
                        res.sendStatus(200);
                    }
                    else {
                        res.sendStatus(500);
                    }
                });
            }
            else {
                // Send error, authentication failed
                 res.sendStatus(501);
            }
        });
    });

    // Create pending event to be authorized
    function createPendingEvent(data, callback) {
        if (!data.ident) data.ident = 'a' + Date.now();

        DataStoreGate.addObjToStore(data, "PendingEvent", data.ident, function(err, data1) {
            if (!err) {
                // If no error
                callback(false, data);
            }
            else {
                // If error
                callback("Error creating pending event in datastore" + err, data);
            }

        });
    }

    // Delete pending event
    function deletePendingEvent(ident, callback) {
        console.log(ident);
        DataStoreGate.deleteObjFromStore("PendingEvent",ident, function(err) {
            if (!err) {
                // If no error
                callback(false);
            }
            else {
                // If error
                callback("Error deleting pending event in datastore: " + err);
            }
        });
    }

    // Get all Peding events
    function getAllPendingEvents(callback) {
        DataStoreGate.getAllObjectsType("PendingEvent", 0, function(err, data) {
            if (!err) {
                // If no error
                callback(false, data);
            }
            else {
                // If error
                callback("Error getting pending events in datastore");
            }
        });
    }

    // Create authoirized event - Add authorized event to google calendar
    function authorizeEvent(data, callback) {
        // TODO - concat data and time
        Calendar.addEvent(data, callback);
        
    }

    return this;
}
