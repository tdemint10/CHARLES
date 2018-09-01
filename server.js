var express    = require('express')
var app        = express()
var http       = require('http').Server(app)
var io         = require('socket.io')(http)
var bodyParser = require('body-parser')

var fs         = require('fs')
var readline   = require('readline')
var {google}   = require('googleapis')

/* Google API */
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_PATH = 'token.json'

/* Load credentials */
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file: ', err)

  // authorize client
  authorize(JSON.parse(content), getCategories)
})

/* Global Variables */
var budgetValues = {}

/*----------------*/
/* SERVER STARTUP */
/*----------------*/

/* STATIC FILES */
app.use(express.static(__dirname + '/public'))

/* Message Endpoint */
app.post('/charles-text', (req, res) => {
  var msg = req.body.text

  console.log(msg)
})

/* SET PORT */
var port = process.env.PORT || 3000

/* LISTEN */
http.listen(port, () => {
  console.log('Listening on port ' + port + '...')
})

/*------------------*/
/* HELPER FUNCTIONS */
/*------------------*/

/* AUTHORIZZE */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  // Check for previously stored token
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/* GET NEW TOKEN */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access__type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url: ', authUrl)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)

      // Store token for later use
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err)
        console.log('Token stored to ', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/* LIST CATEGORIES */
function getCategories(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1OBVXskxKNuiQyQR4zrYJszqmayR4fyRSJ5oPcw8iSbM',
    range: 'Budget!B5:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    var category = 'WORK'
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        if (row[0] && row[1]) {
          var section = row[0]
          if (section.includes('TOTAL')) {
            budgetValues[section] = {
              'projected': parseFloat(row[1].replace(',', '').replace('$', '')),
              'actual': parseFloat(row[2].replace(',', '').replace('$', '')),
              'difference': parseFloat(row[3].replace(',', '').replace('$', ''))
            }
          } else {
            if (budgetValues[category]) {
              budgetValues[category][section] = {
                'projected': parseFloat(row[1].replace(',', '').replace('$', '')),
                'actual': parseFloat(row[2].replace(',', '').replace('$', '')),
                'difference': parseFloat(row[3].replace(',', '').replace('$', ''))
              }
            } else {
              budgetValues[category] = {
                section: {
                  'projected': parseFloat(row[1].replace(',', '').replace('$', '')),
                  'actual': parseFloat(row[2].replace(',', '').replace('$', '')),
                  'difference': parseFloat(row[3].replace(',', '').replace('$', ''))
                }
              }
            }
          }
        } else if (row[0]) {
          if (row[0] != 'INCOME' && row[0] != 'EXPENSES' && row[0] != 'SUMMARY') {
            category = row[0]
            budgetValues[category] = {}
          }
          // console.log(budgetValues)
        }
      });
      console.log(budgetValues)
    } else {
      console.log('No data found.');
    }
  });
}
