const Mailjet = require('node-mailjet').connect('ebedfc71fb5b8ea8e20b38a23fa20949', '3b489bab433ec0b3049f5a12b3a2aa82');


module.exports = function() {


    this.sendMail = function(fromName, subject, receipents, emailBody) {

        function handleError(err) {
            throw new Error(err.ErrorMessage);
        }

        function newContact(email) {
            Mailjet.post('contact')
                .request({
                    Email: email
                })
                .catch(handleError);
        }

        function testEmail(text) {
            var email = {};
            email['FromName'] = fromName;
            email['FromEmail'] = 'Abdallahozaifa19527@gmail.com';
            email['Subject'] = subject;
            email['Recipients'] = receipents;
            email['Text-Part'] = emailBody;

            Mailjet.post('send')
                .request(email)
                .catch(handleError);
        }

        testEmail(emailBody);
    };
    // var receipents = [{
    //             Email: 'Abdallahozaifa19527@gmail.com'
    //         }]
    //this.sendMail(fromName, subject, receipents, emailBody);
    /*this.sendMail("abdallahozaifa19527@gmail.com", "Server", [{
                           Email: "cmoto19@gmail.com"
                        }], "New Password", "Please login with this password to reset your password " + "xxxxxxxxxxx");*/

    return this;
};

// var Email = (function() {
//     /**
//      *
//      * Create : Manage an email sender for a single API key. An e-mail address or a complete domain (*) 
//      * has to be registered and validated before being used to send e-mails. In order to manage a sender 
//      * available across multiple API keys, see the related MetaSender resource.
//      *
//      */
//     const Mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

//     this.options = {
//         // From
//         FromEmail: 'abdallahozaifa19527@gmail.com',
//         FromName: 'Mailjet Demo',
//         // To
//         Recipients: [{
//             Email: 'cmoto19@gmail.com'
//         }],
//         // Subject
//         Subject: 'Hello World!',
//         // Body
//         'Text-part': 'Mailjet on Google App Engine with Node.js',
//         'Html-part': '<h3>Mailjet on Google App Engine with Node.js</h3>'
//     };

//     this.sendMail = function() {
//         var request = Mailjet.post('send').request(this.options);

//         request.then((result) => {
//             console.log(result.body);
//         }).catch((err) => {
//             console.log(err.statusCode);
//         });
//     };
//     this.sendMail();
//     exports.sendMail = this.sendMail;
// });
