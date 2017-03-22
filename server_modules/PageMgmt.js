/**
 * Multer - used for uploading images
 */
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './img'); // In img directory
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({
    storage: storage
}).single('photo');

/**
 *  Server Module for managing user-editable pages
 *  @param{app}             - instance of express
 *  @param{fs}              - instance of fs (file-service)
 *  @param{authentication}  - instance of user authentication
 *  @return                 - itself as ann object
 */
module.exports = function(app, fs, navigation, authentication, DataStoreGate) {


    app.post('/post/pageMgmt/getPageList', function(req, res) {
        // Extracet post data
        var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];

        // Auth. user
        authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
            if (valid) {
                // Read navigation object from datastore
            }
        });
    });


    app.post('/post/pageMgmt/SavePage', function(req, res) {
        // Extracet post data
        var username = req.query['username'];
        var tempkey = req.query['tempkey'];
        var pageName = req.query['pageName'];
        var pageData = req.query['pageData'];

        // Auth. user
        authentication.authenticateUserAdmin(username, tempkey, function(valid) {
            if (valid) {
                // Save new page
                savePage(pageName, pageData, function(msg) {
                    res.send(msg);
                });
            }
        });
    });

    app.post('/post/pageMgmt/DeletePage', function(req, res) {
        // Extract post data
        var username = req.query['username'];
        var tempkey = req.query['tempkey'];
        var pageName = req.query['pageName'];

        // Auth. user
        authentication.authenticateUserAdmin(username, tempkey, function(valid) {
            if (valid) {
                // Delete page
                navigation.deletePage(pageName, function(err, data) {

                    //res.send(msg);
                });
            }
        });
    });

    app.post('/post/pageMgmt/savNav', function(req, res) {
        // Extract post data
        var username = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var newNavFile = req.query['newNavFile'] || req.body['newNavFile'];

        authentication.authenticateUserAdmin(username, tempkey, function(valid) {
            var _REPLY = {
                Result: "ERROR",
                Message: ""
            };
            if (valid) {
                // Save nave
                navigation.saveNavFile(newNavFile, function(err) {
                    if (!err) {
                        _REPLY.Result = "OK";
                        _REPLY.Message = "none";
                    }
                    else {
                        _REPLY.Message = err;
                    }
                    res.send(JSON.stringify(_REPLY));
                });
            }
            else {
                _REPLY.Message = "Auth Fail";
                res.send(JSON.stringify(_REPLY));
            }
        });
    });


    /** POST - for an admon to add a navigatale page
     * Paramaters: (all mandaotry unless otherwise)
     *      username - the username of the user
     *      tempkey - the users current temp key
     *      pageName - the new page name
     *      newNavFile - the new navigation object to save (ie. from page editor) (in string format)
     *  Response Structure: (JSON)
     *      Result: "OK" || "ERROR"
     *      Message: [error]
     *      Record: [user object]
     */
    app.post('/post/pageMgmt/CreatePage', function(req, res) {
        // Extract post data
        var username = req.query['adminUsername'] || req.body['adminUsername'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var pageName = req.query['pageName'] || req.body['pageName'];
        var newNavFile = req.query['newNavFile'] || req.body['newNavFile'];

        // Auth. user
        authentication.authenticateUserAdmin(username, tempkey, function(valid) {
            var _REPLY = {
                Result: "ERROR",
                Message: ""
            };
            if (valid) {
                // Create page
                navigation.addPage(pageName, function(err) {
                    if (!err) {
                        navigation.saveNavFile(newNavFile, function(err) {
                            if (!err) {
                                _REPLY.Result = "OK";
                                _REPLY.Message = "none";
                            }
                            else {
                                _REPLY.Message = err;
                            }
                            res.send(JSON.stringify(_REPLY));
                        });
                    }
                    else {
                        _REPLY.Message = err;
                        res.send(JSON.stringify(_REPLY));
                    }

                });
            }
            else {
                _REPLY.Message = "Auth Fail";
                res.send(JSON.stringify(_REPLY));
            }
        });
    });


    // TODO
    app.post('/post/pageMgmt/upload/Image', function(req, res) {
        // Extract post data
        var username = req.query['username'];
        var tempkey = req.query['tempkey'];
        var imgData = req.query['imgData'];

        // Auth. user
        authentication.authenticateUserAdmin(username, tempkey, function(valid) {
            if (valid) {
                // Call multer to store uploaded image TODO -> fix
                upload(req, res, function(err) {
                    if (err) {
                        console.log(err);
                        return res.end("Error uploading file.");
                    }
                    res.end("File is uploaded");
                });
            }
        });
    });

    return this;
}
