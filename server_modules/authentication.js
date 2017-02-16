var rngString = require("randomstring"); // Random string genorator for temporory key genoration

/**
 *  Authentication server module
 *  @param{app}           - Instance of express
 *  @param{DataStoreGate} - Instance of the google datastore connection
 *  @return               - Itself
 */
module.exports = function(app, DataStoreGate) {

   /** POST - for a user to login, and obtain a temporary key with a ttl of 2 hours
    *  Paramaters: (all mandaotry unless otherwise)
    *      username - the username of the admin
    *      password - the users password
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    */
   app.post('/post/login', function(req, res) {
      var username = req.query['username'] || req.body['username'];
      // var email = req.query['email'] || req.body['email'];
      var password = req.query['password'] || req.body['password'];


      DataStoreGate.getObjFromStore("User", username, onReturn); // Find user in the datastore

      /* Callback for searching datastore for user object TODO -> IMPROVE SECURITY
       * @param {object} result - the user object from the datastoreGate
       */
      function onReturn(err, user) {

         if (err) { // If the returning object is undefined
            // Send Back error with message
            res.send(JSON.stringify({
               Result: "ERROR",
               Message: "Login failed"
            }));
         }
         else {
            if (user.password == password) {
               // Check password to authenticate user

               // Checky if the user already has a temp key, and its ttl is not up
               if (user.tempKey.ttl > Date.now()) {
                  // If valid return the temporary key
                  res.send(JSON.stringify({
                     Result: "OK",
                     key: user.tempKey.key,
                     ttl: user.tempKey.ttl
                  }));

               }
               else {
                  // Create new key for user
                  user.tempKey.key = Date.now() + rngString.generate(); // Generate user temp key {Current time in milliseconds + a random 32 length string} 

                  // New ttl for 2 hours
                  user.tempKey.ttl = Date.now() + 7200000;

                  // Update user in database 
                  DataStoreGate.updateObjFromStore("User", user.username, user, function(err, data) {
                     if (!err) {
                        // If no error updating user object
                        res.send(JSON.stringify({
                           Result: "OK",
                           key: user.tempKey.key,
                           ttl: user.tempKey.ttl
                        })); // Send key and TTL to the user logging in
                     }
                     else {
                        // Send Back error with message
                        res.send(JSON.stringify({
                           Result: "ERROR",
                           Message: err
                        }));
                     }
                  });
               }

            }
            else {
               // Send Back error with message
               res.send(JSON.stringify({
                  Result: "ERROR",
                  Message: "Login failed"
               }));
            }
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
      // Find user in the datastore
      DataStoreGate.getObjFromStore("User", username, function(err, user) {
         // If user is in datastore
         if (!err) {

            // If the key is not expired & If the temp keys match
            if (user.tempKey.ttl > Date.now() && user.tempKey.key == tempKey) {
               callback(true); // callback with true -> transaction passing

            }
            else {
               callback(false); // callback with false -> transaction failed
            }

         }
         else {
            callback(false); // callback with false -> transaction failed
         }
      });
   }

   this.authenticateUserAdmin = function(username, tempKey, callback) {
      // Find user in the datastore
      DataStoreGate.getObjFromStore("User", username, function(err, user) {
         // If user is in datastore
         if (!err) {

            // If the key is not expired & If the temp keys match & are of privlage level 3 or greater
            if (user.tempKey.ttl > Date.now() && user.tempKey.key == tempKey && user.privlageLevel >= 3) {
               callback(true); // callback with true -> transaction passing

            }
            else {
               callback(false); // callback with false -> transaction failed
            }

         }
         else {
            callback(false); // callback with false -> transaction failed
         }
      });
   }

   return this;
};


/*

*/
