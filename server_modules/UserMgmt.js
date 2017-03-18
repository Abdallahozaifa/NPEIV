var UserObject = require("./DataObjects/UserObject.js"); // Refrence for creating user objects

/**
 *  Server Module for managing user-editable pages
 *  @param{randomString}    - instance of random string
 *  @param{app}             - instance of express
 *  @param{Authentication}  - instance of user authentication
 *  @param{DataStoreGate}   - instance of the google data-store gate
 *  @param{email}           - instance of email services
 *  @return                 - itself as ann object
 *  
 */
module.exports = function(randomString, app, Authentication, DataStoreGate, Email) {

   /** POST - for an admin to create a new user
    *  Paramaters: (all mandaotry unless otherwise)
    *      adminUsername - the username of the admin
    *      tempkey - the admins current temp key
    *      username - the username of the new user
    *      password - password for the new user (optional
    *      email - the new usera email (optional)
    *      preFix - the new user name prefix (optional)
    *      Fname - the new user first name (optional)
    *      Lname - the new user last name (optional)
    *      title - the tile of the new user (optional)
    *      privlageLevel - the new user privlage leve (optional) (default = 1) (memeber = 1, admin = 3)
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    *      Record: [new user object]
    */
   app.post('/post/userMgmt/newUser', function(req, res) {
      // Extracet post data
      var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];

      // Extract new user data (either body or in path string query)
      var NEW_USER = new UserObject.UserObject({
         username: req.body['username'] || req.body['username'],
         password: req.body['password'] || req.query['password'],
         email: req.body['email'] || req.query['email'],
         preFix: req.body['preFix'] || req.query['preFix'],
         title: req.body['title'] || req.query['title'],
         Fname: req.body['Fname'] || req.query['Fname'],
         Lname: req.body['Lname'] || req.query['Lname'],
         privlageLevel: req.body['privlageLevel'] || req.query['privlageLevel']
      });

      // Auth. user
      Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
         if (valid) {
            // Add user to datastore
            DataStoreGate.addObjToStore(NEW_USER, "User", NEW_USER.username, function(err, data) {
               if (err) {
                  // Send Back error with message
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: err
                  }));
               }
               else {
                  // Send back ok, with new object
                  res.send(JSON.stringify({
                     Result: "OK",
                     Record: data
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

   /** POST - for an admin to delete a new user
    *  Paramaters: (all mandaotry unless otherwise)
    *      adminUsername - the username of the admin
    *      tempkey - the admins current temp key
    *      username - the username of the user to delete
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    */
   app.post('/post/userMgmt/deleteUser', function(req, res) {
      // Extracet post data
      var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];
      var username_TODELETE = req.query['username'] || req.body['username'];

      // Auth. user
      Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
         if (valid) {
            if (username_TODELETE == adminUsername) {
               // Can't delete yourself
               // Send error
               res.send(JSON.stringify({
                  Result: "ERROR",
                  Message: "Can not delete yourself"
               }));
            }
            else {
               // Delete user in datastore 
               DataStoreGate.deleteObjFromStore("User", username_TODELETE, function(err) {
                  if (err) {
                     // Send Back error with message
                     res.send(JSON.stringify({
                        Result: "ERROR",
                        Message: err
                     }));
                  }
                  else {
                     // Send back ok, with new object
                     res.send(JSON.stringify({
                        Result: "OK"
                     }));
                  }
               });
            }

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

   /** POST - for an admin to udate a users info
    *  Paramaters: (all mandaotry unless otherwise)
    *      adminUsername - the username of the admin
    *      tempkey - the admins current temp key
    *      username - the username of the user
    *      email - the new usera email (optional)
    *      preFix - the new user name prefix (optional)
    *      Fname - the new user first name (optional)
    *      Lname - the new user last name (optional)
    *      title - the tile of the new user (optional)
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    *      Record: [user object]
    */
   app.post('/post/userMgmt/updateUser', function(req, res) {
      // Extracet post data
      var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];

      // Extract new user data (either body or in path string query) 
      var user_data = {
         username: req.body['username'] || req.body['username'],
         email: req.body['email'] || req.body['email'],
         preFix: req.body['preFix'] || req.query['preFix'],
         title: req.body['title'] || req.query['title'],
         Fname: req.body['Fname'] || req.query['Fname'],
         Lname: req.body['Lname'] || req.query['Lname'],
         privlageLevel: req.body['privlageLevel'] || req.query['privlageLevel']
      };

      // Auth. user
      Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
         if (valid) {
            // Get current user object from datastore (for perserving password and tempKey data)
            DataStoreGate.getObjFromStore("User", user_data.username, function(err, user) {
               if (err) {
                  // Send Back error with message
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: err
                  }));
               }
               else {
                  // Update user data (excluding username b/c it's the primary key)
                  user.email = user_data.email;
                  user.preFix = user_data.preFix;
                  user.title = user_data.title;
                  user.Fname = user_data.Fname;
                  user.Lname = user_data.Lname;
                  if (adminUsername != user_data.username) {
                     // Cant deprivlage yourself
                     user.privlageLevel = user_data.privlageLevel;
                  }


                  // Update object in datastore
                  DataStoreGate.updateObjFromStore("User", user_data.username, user, function(err, data) {
                     if (err) {
                        // Send Back error with message
                        res.send(JSON.stringify({
                           Result: "ERROR",
                           Message: err
                        }));
                     }
                     else {
                        // Send back ok, with new object
                        res.send(JSON.stringify({
                           Result: "OK",
                           Record: data
                        }));
                     }
                  });

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

   /** POST - for an admin to obtain all users
    *  Paramaters: (all mandaotry unless otherwise)
    *      adminUsername - the username of the admin
    *      tempkey - the admins current temp key
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    *      Records: [user object]
    */
   app.post('/post/userMgmt/getAllUsers', function(req, res) {
      // Extracet post data
      var adminUsername = req.query['adminUsername'] || req.body['adminUsername'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];

      // Auth. user
      Authentication.authenticateUserAdmin(adminUsername, tempkey, function(valid) {
         if (valid) {
            // Get all user in datastore TODO
            DataStoreGate.getAllObjectsType("User", 0, function(err, data) {
               if (err) {
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: err
                  }));
               }
               else {
                  // Remove passwords and temKey data, for security
                  for (var i = 0; i < data.length; i++) {
                     try {
                        data[i].password = null;
                        data[i].temKey = null;
                     }
                     catch (e) {
                        // Ignore
                     }
                  }

                  // Send back OK, with all user objects
                  res.send(JSON.stringify({
                     Result: "OK",
                     Records: data
                  }));
               }
            })
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

   /** POST - a user to update get their info
    * Paramaters: (all mandaotry unless otherwise)
    *      username - the username of the user
    *      tempkey - the users current temp key
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    *      Record: [ [user object] ]
    */
   app.post('/post/user/getUser', function(req, res) {
      // Extracet post data
      var username = req.query['username'] || req.body['username'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];

      // Auth. user
      Authentication.authenticateUser(username, tempkey, function(valid) {
         // A user can only edit their own tivail information
         if (valid) {
            // Get current user object from datastore (for perserving password and tempKey data)
            DataStoreGate.getObjFromStore("User", username, function(err, user) {
               if (err) {
                  // Send Back error with message
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: err
                  }));
               }
               else {
                  // Remove temp key and password from object to be sent
                  user.password = null;
                  user.tempKey = null;

                  // Send back ok, with the user object
                  res.send(JSON.stringify({
                     Result: "OK",
                     Record: user
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

   /** POST - for a user to update their info
    * Paramaters: (all mandaotry unless otherwise)
    *      username - the username of the user
    *      tempkey - the users current temp key
    *      email - the new usera email (optional)
    *      preFix - the new user name prefix (optional)
    *      Fname - the new user first name (optional)
    *      Lname - the new user last name (optional)
    *      title - the tile of the new user (optional)
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    *      Record: [user object]
    */
   app.post('/post/user/updateUser', function(req, res) {
      // Extracet post data
      var username = req.query['username'] || req.body['username'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];

      // Extract new user data (either body or in path string query) 
      var user_data = {
         email: req.body['email'] || req.body['email'],
         preFix: req.body['preFix'] || req.query['preFix'],
         title: req.body['title'] || req.query['title'],
         Fname: req.body['Fname'] || req.query['Fname'],
         Lname: req.body['Lname'] || req.query['Lname']
      };

      // Auth. user
      Authentication.authenticateUser(username, tempkey, function(valid) {
         // A user can only edit their own tivail information
         if (valid) {
            // Get current user object from datastore (for perserving password and tempKey data)
            DataStoreGate.getObjFromStore("User", user_data.username, function(err, user) {
               if (err) {
                  // Send Back error with message
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: err
                  }));
               }
               else {
                  // Update user data (excluding username b/c it's the primary key, and priv. lvl b/c they don't have the privlage to change it
                  user.email = user_data.email;
                  user.preFix = user_data.preFix;
                  user.title = user_data.title;
                  user.Fname = user_data.Fname;
                  user.Lname = user_data.Lname;

                  // Update object in datastore
                  DataStoreGate.updateObjFromStore("User", user_data.username, user, function(err, data) {
                     if (err) {
                        // Send Back error with message
                        res.send(JSON.stringify({
                           Result: "ERROR",
                           Message: err
                        }));
                     }
                     else {
                        // Send back ok, with new object
                        res.send(JSON.stringify({
                           Result: "OK",
                           Record: data
                        }));
                     }
                  });

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


   /** POST - for a user to update their info  TODO -> FINISH
    * Paramaters: (all mandaotry unless otherwise)
    *      username - the username of the user
    *      email - the email of the user (only needed if without temp key)
    *      tempkey - the users current temp key (optional)
    *      newpassword - the users new desired password (optional)
    *  Response Structure: (JSON)
    *      Result: "OK" || "ERROR"
    *      Message: [error]
    */
   app.post('/post/user/resetPassword', function(req, res) {
      // Extracet post data
      var username = req.query['username'] || req.body['username'];
      var email = req.query['email'] || req.body['email'];
      var tempkey = req.query['tempkey'] || req.body['tempkey'];
      var newpassword = req.query['newpassword'] || req.body['newpassword'];

      if (tempkey) {
         // If the user is already logged in
         // Authenticat uesr
         Authentication.authenticateUser(username, tempkey, function(valid) {
            if (valid) {
               // If authenication is true
               if (Authentication.validatePasswordComplexity(newpassword)) {
                  // If new password passes complexity test
                  // Update user object
                  DataStoreGate.getObjFromStore("User", username, function(err, user) {
                     if (err) {
                        // Send Back error with message
                        res.send(JSON.stringify({
                           Result: "ERROR",
                           Message: "Datastore Error: " + err
                        }));
                     }
                     else {
                        // Update user data (excluding username b/c it's the primary key, and priv. lvl b/c they don't have the privlage to change it
                        user.password = newpassword;

                        // Update object in datastore
                        DataStoreGate.updateObjFromStore("User", user.username, user, function(err, data) {
                           if (err) {
                              // Send Back error with message
                              res.send(JSON.stringify({
                                 Result: "ERROR",
                                 Message: err
                              }));
                           }
                           else {
                              // Send back ok, with new object
                              res.send(JSON.stringify({
                                 Result: "OK"
                              }));
                           }
                        });

                     }

                  });

               }
               else {
                  // Send error, password not complex enough
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: "New password not complex enough"
                  }));
               }
            }
            else {
               // Send error, authentication failed
               res.send(JSON.stringify({
                  Result: "ERROR",
                  Message: "Authentication Fail"
               }));
            }
         });

      }
      else {
         // If the user is not logged in TODO
         // Validate user exist in datastore
         DataStoreGate.getObjFromStore("User", username, function(err, user) {
            if (err) {
               // Send Back error with message
               res.send(JSON.stringify({
                  Result: "ERROR",
                  Message: err
               }));
            }
            else {
               if (true) {
                  // TODO (email == user.email)
                  // If the email provied matches the one stored
                  // Generate a new 16 length password 
                  var new_password =  randomString.generate(16);
                  user.password = new_password;

                  // Save updated user object
                  DataStoreGate.updateObjFromStore("User", username, user, function(err, user) {
                     if (err) {
                        // Send Back error with message
                        res.send(JSON.stringify({
                           Result: "ERROR",
                           Message: err
                        }));
                     }
                     else {
                        // Send email with noew password
                        Email.sendMail("noreply-NPEIV", "NPEIV Password Reset", [{
                           Email: user.email
                        }], "New Password - Please login with this password to reset your password:\n" + new_password);
                        console.log(new_password);
                        // Send back ok, with new object
                        res.send(JSON.stringify({
                           Result: "OK"
                        }));
                     }
                  });
               }
               else {
                  // Send Back error with message
                  res.send(JSON.stringify({
                     Result: "ERROR",
                     Message: "ERROR:  Email mismatch"
                  }));
               }

            }

         });

         // Send email with new randomy generated passowrd

      }

   });

   return this;
}