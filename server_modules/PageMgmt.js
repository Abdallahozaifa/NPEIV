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
module.exports = function(app, fs, navigation, authentication) {
    
    
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
        authentication.authenticateUserExecutor(username, tempkey, function(valid) {
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
        authentication.authenticateUserExecutor(username, tempkey, function(valid) {
            if (valid) {
                // Delete page
                deletePage(pageName, function(msg) {
                    res.send(msg);
                });
            }
        });
    });

    app.post('/post/pageMgmt/CreatePage', function(req, res) {
        // Extract post data
        var username = req.query['username'];
        var tempkey = req.query['tempkey'];
        var pageName = req.query['pageName'];

        // Auth. user
        authentication.authenticateUserExecutor(username, tempkey, function(valid) {
            if (valid) {
                // Create page
                createPage(pageName, function(msg) {
                    res.send(msg);
                });
            }
        });
    });

    app.post('/post/pageMgmt/upload/Image', function(req, res) {
        // Extract post data
        var username = req.query['username'];
        var tempkey = req.query['tempkey'];
        var imgData = req.query['imgData'];

        // Auth. user
        authentication.authenticateUserExecutor(username, tempkey, function(valid) {
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
    
    /**
     *  Delte editable page
     *  @param{name}        - Name of the page
     *  @param{callback}    - callback
     */
    function deletePage(name, callback) {
        // Delete page from direcotry
    }
    
    /**
     *  Save new editable page
     *  @param{name}        - Name of the page
     *  @param{data}        - The data for the page
     *  @param{callback}    - callback
     */
    function savePage(name, data, callback) {
        // Back up current page

        // Save new page

    }
    
    /**
     *  Create new editable page
     *  @param{name}        - Name of the page
     *  @param{callback}    - callback
     */
    function createPage(name, callback) {
        // Pare name for .html
        var filename = name.split(".")[0] + ".html";
        
        // Read blank page template
        
        // Save as new file

    }
    
    /**
     *  Create new editable page
     *  @param{name}        - Name of the page
     *  @param{callback}    - callback
     */
    function backUp(fileName, data, callback) {
        // Pare name for .html
        var filename = Date.now() + "-" + fileName;
        
        fs.writeFile(filename , data, (err) => {
          if (err) throw err;
          console.log(filename + 'has been saved!');
        });
    }
    
    

    return this;
}
