var rngString = require("randomstring");

module.exports = function(app, DataStoreGate) {

  app.post('/post/login', function(req, res) {
    var username = req.query['username'];
    var password = req.query['password'];

    DataStoreGate.getObjFromStore("User", username, onReturn); // Find user in the datastore

    /* Callback for searching datastore for user object TODO -> IMPROVE SECURITY
     * @param {object} result - the user object from the datastoreGate
     */
    function onReturn(result) {

      if (result == undefined) { // If the returning object is undefined
        res.send("FAIL - user not found"); // Respond with false -> denial of entry
      }
      else {
        if (result.password == password) {
          // Check password to authenticate user

          // Search datastor to see if the users already has temp key
          DataStoreGate.getObjFromStore("TempUserKey", username, function(result) {
            if (result == undefined) {
              // If the return is undefined generate a new temp key for the user
              var key = Date.now() + rngString.generate(); // Generate user temp key {Current time in milliseconds + a random 32 length string} 

              /* Store users temp key in datastore
                 username : the users username
                 key : the users new temp key
                 ttl : time to live is 2 hours
              */
              DataStoreGate.addObjToStore({
                username: username,
                key: key,
                ttl: (Date.now() + 7200000)
              }, 'TempUserKey', username, function(err) {
                if (err) {
                  // If error, send to user
                  res.send(err)
                }
                else {
                  // Send new temp key to user
                  res.send(key);
                }
              });


            }
            else {
              // If the user already has a temp key, send it to them
              res.send(result.key);
            }
          }); // Find user in datastore

        }
        else {
          res.send("FAIL - invalid password"); // Respond with false -> denial of entry
        }
      }
    }

  });

  app.post('/post/logout', function(req, res) {
    var username = req.query['username'];
    var tempKey = req.query['key'];

    this.authenticateUser(username, tempKey, onReturn);

    function onReturn(valid) {
      if (valid) {
        // If the user was successfully authenticated
        // Log them out / delete their temp key
        DataStoreGate.deleteObjFromStore("TempUserKey", username, function(err) {
          if (err) {
            res.send(false); // If deleted failed
          }
          else {
            res.send(true); // If successfully deleted
          }
        });
      }
      else {
        // If the user was not successfully 
        res.send(false); // Failed auth
      }
    }

  });

  /**
   * Authenicates if a user with their temp key
   * PRE - the user must be logged in
   * @param {String} username - the type of data being added to the datastore
   * @param {String} tempKey - the value of the data being added
   * @param {function} callback(valid) - callback function, passing if the transaction is valid
   * @return {function} callback - callback function
   */
  this.authenticateUser = function(username, tempKey, callback) {
    DataStoreGate.getObjFromStore("TempUserKey", username, function(result) {
      if (result == undefined || tempKey != result.key) {
        // If the user has no temp key (result undefined), or it does not match the stored temp key
        callback(false); // callback with false -> transaction failed
      }
      else {
        // If the user has a temp key (result string), and it matches the passed temp key
        callback(true); // callback with true -> transaction passing
        
        // Update users temp keys ttl for another 2 hours
        result.ttl = Date.now() + 7200000;
        DataStoreGate.updateObjFromStore("TempUserKey", username, result, function(err) {
          if (err){
            //
          }
        })
      }
    });
  }
  
  
  
  /*
    Intervaled function to clear expired user temp keys from the datastore
    runs every 30 min
  */
  setInterval(function() {
    // Get all TempUserKey types from datastore
    // If the current time is past the ttl, then remove them
  }, 180000);

  return this;
};


/*
  DataStoreGate.addObjToStore({
    fName: "Clint",
    lName: "Motosicky",
    userName: "cxm818",
    password: "guest"
  }, "User", "cxm818", function(err) {
    console.log(err);
  });
  DataStoreGate.addObjToStore({
    fName: "Luke",
    lName: "Poniatowski",
    userName: "lhp5025",
    password: "guest"
  }, "User", "lhp5025", function(err) {
    console.log(err);
  });

  DataStoreGate.getObjFromStore("User", "lhp5025", function(result) {
    console.log("Object retrieved from Store: " + JSON.stringify( result));
  });
    
  $.post( "https://npeiv-webapp-abdallahozaifa.c9users.io/post/login?username=lhp5025&password=guest", function( data ) {
    console.log( data );
  });
*/
