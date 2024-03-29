module.exports = function(root) {
  var fs = require('fs');
  var readline = require('readline');
  var google = require('googleapis');
  var googleAuth = require('google-auth-library');

  // If modifying these scopes, delete your previously saved credentials
  // at ~/.credentials/calendar-nodejs-quickstart.json
  var SCOPES = ['https://www.googleapis.com/auth/calendar'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
  var calendar = google.calendar('v3');

  // Load client secrets from a local file. https://calendar.google.com/calendar/embed?src=3bc746je177o4qhuf8it6nne00%40group.calendar.google.com&ctz=America/New_York
  this.addEvent = function(data, callback) {

    function addEvent(auth) {
      var parsedTime1 = '';
      var parsedTime2 = '';
      try {
        if (data.time1.search(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/) == 0) {
          parsedTime1 = data.time1;
        }


        if (data.time2.search(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/) == 0) {
          parsedTime2 = data.time2;
        }
      }
      catch (e) {
        // Ignore
      }

      var date1 = new Date(data.date + ' ' + parsedTime1);
      date1.setHours(date1.getHours() + 4);
      var date2 = new Date(data.date + ' ' + parsedTime2);
      date2.setHours(date2.getHours() + 4);
    
      var event = {
        'summary': data.name,
        'location': data.location,
        'description': data.description,
        'start': {
          'dateTime': date1,
          'timeZone': 'America/New_York',
        },
        'end': {
          'dateTime': date2,
          'timeZone': 'America/New_York',
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=1'
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [{
            'method': 'email',
            'minutes': 24 * 60
          }, {
            'method': 'popup',
            'minutes': 10
          }, ],
        },
      };

      calendar.events.insert({
        auth: auth,
        calendarId: '3bc746je177o4qhuf8it6nne00@group.calendar.google.com',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          callback(err);
          return;
        }
        else {
          callback(false);
        }
        console.log('Event created: %s', event.htmlLink);
      });
    }

    fs.readFile(root + '/server_modules/client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), addEvent);
      // authorize(JSON.parse(content), listEvents);
    });

  }



  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    console.log(credentials.web.redirect_uris[0]);
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      }
      else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
  }

  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    }
    catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    calendar.events.list({
      auth: auth,
      calendarId: '3bc746je177o4qhuf8it6nne00@group.calendar.google.com',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var events = response.items;
      if (events.length == 0) {
        console.log('No upcoming events found.');
      }
      else {
        console.log('Upcoming 10 events:');
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var start = event.start.dateTime || event.start.date;
          console.log('%s - %s', start, event.summary);
        }
      }
    });
  }

  function addEvent(auth) {
    var event = {
      'summary': 'Google I/O 2017',
      'location': '800 Howard St., San Francisco, CA 94103',
      'description': 'A chance to hear more about Google\'s developer products.',
      'start': {
        'dateTime': '2017-04-08T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles',
      },
      'end': {
        'dateTime': '2017-04-08T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [{
        'email': 'lpage@example.com'
      }, {
        'email': 'sbrin@example.com'
      }, ],
      'reminders': {
        'useDefault': false,
        'overrides': [{
          'method': 'email',
          'minutes': 24 * 60
        }, {
          'method': 'popup',
          'minutes': 10
        }, ],
      },
    };

    calendar.events.insert({
      auth: auth,
      calendarId: '3bc746je177o4qhuf8it6nne00@group.calendar.google.com',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    });
  }
  return this;
}
