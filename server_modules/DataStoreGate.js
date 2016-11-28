var DataStoreGate = (function () {
      
      var datastore = require('@google-cloud/datastore');
      
      // Instantiate a datastore client
      var datastoreClient = datastore({
        projectId: 'npeiv-webapp',
        keyFilename: __dirname + '/keyfile.json'
      });
      
      /**
       * Adds an object to the datastore
       * @param {object} obj - any object 
       * @param {String} kind - the type of data being added to the datastore
       * @param {String} primKey - the value of the data being added
       * @param {function} callback - callback function
       * @return {function} callback - callback function
       */
       this.addObjToStore = function(obj, kind, primKey, callback) {
         this.getObjFromStore(kind, primKey, function(result){
          if(result == undefined){
            
            var objKey = datastoreClient.key([kind, primKey]);
            datastoreClient.save({
                key: objKey,
                data: obj
              }, function (err) {
                 if (err) {
                 return callback(err);
              }
        
              console.log(kind + ": " + primKey + ' created successfully.');
            });
          }else{
            console.log(kind + ": " + primKey + ' already exists.');
            return callback(null);
          } 
        });
      };
      
      /**
       * Removes an object from the datastore
       * @param {String} kind - the type of data being added to the datastore
       * @param {String} primKey - the value of the data being added
       * @param {function} callback - callback function
       * @return {function} callback - callback function
       */
      this.deleteObjFromStore = function(kind, primKey, callback) {
        this.getObjFromStore(kind, primKey, function(result){
          if(result != undefined){
            var objKey = datastoreClient.key([kind, primKey]);
         
            datastoreClient.delete(objKey, function (err) {
              if (err) {
                  return callback(err);
              }
              console.log(objKey);
              console.log(kind + ": " + primKey + ' deleted successfully.');
              return callback(null);
            });
          }else{
            console.log(kind + ": " + primKey + ' does not exist.');
            return callback(null);
          } 
        });
      };
      
      /**
       * Gets an object from the datastore
       * @param {String} kind - the type of data being added to the datastore
       * @param {String} primKey - the value of the data being added
       * @param {function} callback - callback function
       * @return {function} callback - callback function
       */
      this.getObjFromStore = function(kind, primKey, callback){
        var objKey = datastoreClient.key([kind, primKey]);
        
        datastoreClient.get(objKey, function(err, entity) {
          return callback(err || entity);
        });
      };
      
      /* !!!!NEEDS REWORK!!!!*/
      /**
       * Updates an object from the datastore
       * @param {String} kind - the type of data being added to the datastore
       * @param {String} primKey - the value of the data being added
       * @param {function} callback - callback function
       * @return {function} callback - callback function
       */
      this.updateObjFromStore = function(kind, primKey, callback){
        this.getObjFromStore(kind, primKey, function(result){
          if(result != undefined){
            
            var objKey = datastoreClient.key([kind, primKey]);
            datastoreClient.save({
                key: objKey,
                data: obj
              }, function (err) {
                 if (err) {
                 return callback(err);
              }
        
              console.log(kind + ": " + primKey + ' created successfully.');
            });
            var objKey = datastoreClient.key([kind, primKey]);
        
            datastoreClient.get(objKey, function(err, entity) {
              return callback(err || entity);
            });
          }
        });
      };
        
  exports.addObjToStore = this.addObjToStore;
  exports.deleteObjFromStore = this.deleteObjFromStore;
  exports.getObjFromStore = this.getObjFromStore;
  exports.updateObjFromStore = this.updateObjFromStore;
        
  /*
    Database Example
    DataStoreGate.addObjToStore({fName: "Hozaifa", lName: "Abdalla"}, "User", "Hozaifa Abdalla", function(err){
      console.log(err); 
    });
    
    DataStoreGate.deleteObjFromStore("User", "Hozaifa Abdalla", function(err){
      console.log(err);
    });
    
    DataStoreGate.getObjFromStore("User", "Hozaifa Abdalla", function(result){
      console.log("Object retrieved from Store: " + result); 
    });
  */
});