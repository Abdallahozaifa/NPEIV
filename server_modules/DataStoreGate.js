module.exports = function() {
   var datastore = require('@google-cloud/datastore');

   // Instantiate a datastore client
   var datastoreClient = datastore({
      projectId: 'mindful-syntax-162801',
      keyFilename: __dirname + '/keyfile.json'
   });

   /**
    * Adds an object to the datastore
    * @param {object} obj - any object 
    * @param {String} kind - the type of data being added to the datastore
    * @param {String} primKey - the value of the data being added
    * @param {function} callback (err, data) - callback function
    * @return {function} callback(err, data) - callback function
    */
   this.addObjToStore = function(obj, kind, primKey, callback) {
      this.getObjFromStore(kind, primKey, function(err, result) {

         // If the object is not found in the database already
         if (result == undefined) {
            var objKey = datastoreClient.key([kind, primKey]);

            datastoreClient.save({
               key: objKey,
               data: obj
            }, function(err) {
               if (err) {
                  return callback(err); // Send error
               }
               else {
                  return callback(false, obj); // No error, return object
               }
               console.log(kind + ": " + primKey + ' created successfully.');
            });
         }

         // If the object is found in the database 
         else {
            console.log(kind + ": " + primKey + ' already exists.');
            return callback('Entity already exists');
         }
      });
   };

   /**
    * Removes an object from the datastore
    * @param {String} kind - the type of data being added to the datastore
    * @param {String} primKey - the value of the data being added
    * @param {function} callback (err)- callback function
    * @return {function} callback (err) - callback function
    */
   this.deleteObjFromStore = function(kind, primKey, callback) {
      this.getObjFromStore(kind, primKey, function(err, result) {
         if (err) {
            // If the object is not found in the database or there was an error
            return callback(err);
         }
         else {
            // If the object is found in database
            var objKey = datastoreClient.key([kind, primKey]);

            datastoreClient.delete(objKey, function(err) {
               if (err) {
                  return callback(err);
               }
               //console.log(objKey);
               console.log(kind + ":" + primKey + ' (deleted successfull)');
               return callback(false);
            });

         }
      });
   };

   /**
    * Gets an object from the datastore
    * @param {String} kind - the type of data being added to the datastore
    * @param {String} primKey - the value of the data being added
    * @param {function} callback (error, data)- callback function
    * @return {function} callback(error, data) - callback function
    */
   this.getObjFromStore = function(kind, primKey, callback) {
      var objKey = datastoreClient.key([kind, primKey]);

      datastoreClient.get(objKey, function(err, entity) {
         if (entity != null) {
            // If the object is found in the datastore
            return callback(false, entity); // Callback with entity, and a null error message
         } else {
            // If the object was not found
            // console.log(kind + ": " + primKey + ' does not exist.');
            return callback("Error: entity not found-> " + kind + " : " + primKey); // Callback with error message
         }
          
      });
   };

   /* !!!! TODO NEEDS REWORK!!!!*/
   /**
    * Updates an object from the datastore
    * @param {String} kind - the type of data being added to the datastore
    * @param {String} primKey - the value of the data being added
    * @param {function} callback (error, data) - callback function
    * @return {function} callback (error, data) - callback function
    */
   this.updateObjFromStore = function(kind, primKey, obj, callback) {
      this.getObjFromStore(kind, primKey, function(err, result) {

         if (err) {
            console.log(kind + ": " + primKey + ' does not exist.');
            return callback("Entity does not exist"); // If there is no entity, pass error and no data
         }
         else {
            // If there was no error in retrieving the object
            var objKey = datastoreClient.key([kind, primKey]);
            datastoreClient.save({
               key: objKey,
               data: obj
            }, function(err) {
               if (err) {
                  return callback(err); // If there was an error, pass error and no data
               }
               else {
                  console.log(kind + ": " + primKey + ' created successfully.');
                  return callback(false, obj);
               }
            });
         }
      });
   };

   /**
    * Gets all objects with a certain type from the datastore
    * @param {String} kind - the type of data being added to the datastore
    * @param {String} token - gives the ability to request additional information
    * @param {function} callback(err, data) - callback function
    */
   this.getAllObjectsType = function(kind, token, callback) {
      var q = datastoreClient.createQuery([kind]);
      //.start(token); // amt

      datastoreClient.runQuery(q, (err, entities, nextQuery) => {
         // Callback (err,data)
         if (err) {
            return callback(err, null); // Callback with error
         }
         else {
            const hasMore = nextQuery.moreResults !== datastoreClient.NO_MORE_RESULTS ? nextQuery.endCursor : false;
            return callback(null, entities); // Callback with data
         }

      });
   };

   exports.addObjToStore = this.addObjToStore;
   exports.deleteObjFromStore = this.deleteObjFromStore;
   exports.getObjFromStore = this.getObjFromStore;
   exports.updateObjFromStore = this.updateObjFromStore;
   exports.getAllObjectsType = this.getAllObjectsType;

   /*
  DATABASE EXAMPLE!!!
  
  DataStoreGate.getAllObjectsType("User", "", function(err, users, hasMore){
    users.forEach(function(user){
        console.log("Object retrieved from Store: " + JSON.stringify(user)); 
    });
});
  */
   return this;
};
