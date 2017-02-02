var Email = (function(){
   /**
     *
     * Create : Manage an email sender for a single API key. An e-mail address or a complete domain (*) 
     * has to be registered and validated before being used to send e-mails. In order to manage a sender 
     * available across multiple API keys, see the related MetaSender resource.
     *
     */
    const Mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

    this.options = {
        // From
        FromEmail: 'abdallahozaifa19527@gmail.com',
        FromName: 'Mailjet Demo',
        // To
        Recipients: [{Email: 'abdallahozaifa19527@gmail.com'}],
        // Subject
        Subject: 'Hello World!',
        // Body
        'Text-part': 'Mailjet on Google App Engine with Node.js',
        'Html-part': '<h3>Mailjet on Google App Engine with Node.js</h3>'
    };
    
    this.sendMail = function(){
        var request = Mailjet.post('send').request(this.options);
    
        request.then((result) => {
            console.log(result.body);
        }).catch((err) => {
            console.log(err.statusCode);
        });    
    };
    
    exports.sendMail = this.sendMail;
});