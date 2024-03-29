var rngString = require("randomstring"); // Random string genorator for temporory password genoration
/**
 * UserObject Class
 * !!! WARNING: EDITING EXISTING MEMBERS OF THIS OBJECT IS DANGEROUS !!!
 */
exports.UserObject = function(obj) {
    if ( (obj.username) && (obj.username.length > 0) ) {
        this.username = obj.username; // MANDATORY! The users username (and primary key in datastore)
        this.password = obj.password || rngString.generate(16); // MANDATORY! The users password of length 16
        
        this.privlageLevel = obj.privlageLevel || 1; // The usrs privage leve {1-Regular member, 3-Executor(admin)}
        
        this.email = obj.email || "";
        
        // The usres temporory key for authentication after logged in
        this.tempKey = {
            key: "", // The key value
            ttl: 0 // The ttl for that key value
        };

        this.preFix = obj.preFix || ""; // The users prefix (mr. mrs. ms. dr.)
        this.title = obj.title || ""; // The users title
        this.Fname = obj.Fname || "[First Name]"; // The users first name
        this.Lname = obj.Lname || "[Last Name]"; // The users last name
        this.affiliation = obj.affiliation || ""; // The users affiliation to the org TODO
        this.actionTeams = obj.actionTeams || []; // The users action team TODO
        

        return this; // Return an instance of this object

    }
    else {
        throw "ERROR Username required";
    }

}
exports.TYPE = "User"; // The type name used in the datastore
