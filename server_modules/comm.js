/*
 *  Authentication server module
 *  @param{app}             - Instance of express
    @param{authentication}  - Instance of randomstring
 *  @param{email}           - Instance of mailjet services
 *  
 *  @return                 - Itself
 */
module.exports = function(app, Authentication, DataStoreGate, email) {

    app.post('/msg/send', function(req, res) {
        // Extracet post data
        var username = req.query['username'] || req.body['username'];
        var tempkey = req.query['tempkey'] || req.body['tempkey'];
        var actionTeams = req.query['actionTeams'] || req.body['actionTeams']; //array of numbers
        var subject = req.query['subject'] || req.body['subject'];
        var message = req.query['message'] || req.body['message'];

        Authentication.authenticateUser(username, tempkey, function(valid) {



            DataStoreGate.getAllObjectsType("User", 0, function(err, data) {
                if (err) {
                    res.send(JSON.stringify({
                        Result: "ERROR",
                        Message: err
                    }));
                }
                else {
                    var receipents = [];
                    for (var i = 0; i < data.length; i++) {
                        
                        try {
                            for (var j = 0; j < actionTeams.length; j++) {
                                if (data[i].actionTeams.indexOf(actionTeams[j]+'') != -1) {
                                    receipents.push({Email: data[i].email});
                                    break;
                                }
                            }
                        }
                        catch (e) {

                        }

                        
                    }
                    //console.log(receipents);
                    
                    email.sendMail('noReply-NPEIV', subject, receipents, message);
                    
                    // Send back OK, with all user objects
                    res.send(JSON.stringify({
                        Result: "OK",
                        Records: data
                    }));
                }
            })

            
        });
    });

    return this;
}
