var Schema = (function () {
    
  /**
   * Generates a new user object
   * @param {String} firstName - any object 
   * @param {String} lastName - the type of data being added to the datastore
   * @param {String} email - the value of the data being added
   * @param {String} password - the value of the data being added
   * @return {Object} user object - user object
   */
    this.newUser = function(firstName, lastName, email, password){
        return {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };
    };
    
  /**
   * Generates a new email object
   * @param {String} to - to address
   * @param {String} from - from address
   * @param {Array} cc - the value of the data being added
   * @param {Array} bcc - the value of the data being added
   * @param {String} subject - the subject of the email
   * @param {String} content - the content of the email
   * @param {Array} attachments - array of files
   * @return {Object} user object - user object
   */
    this.newEmail = function(to, from, cc, bcc, subject, content, attachments){
        return {
            to: to,
            from: from,
            cc: cc,
            bcc: bcc,
            subject: subject,
            content: content,
            attachments: attachments
        };
    };
    
    exports.newUser = this.newUser;
    exports.newEmail = this.newEmail;
});