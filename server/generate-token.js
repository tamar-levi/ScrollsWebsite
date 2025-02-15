const readline = require('readline');
const fs = require('fs');
const { google } = require('googleapis');

// החלק של הסקופים
const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 
    'https://www.googleapis.com/auth/gmail.modify' ];
const CREDENTIALS_PATH = 'C:/Users/User/Documents/Scrolls website/server/credentials.json';
const TOKEN_PATH = 'C:/Users/User/Documents/Scrolls website/server/token.json';

// קריאת האישורים
function loadCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// יצירת אישור OAuth2
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  rl.question('Enter the code from that page here: ', async (code) => {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Token stored to', TOKEN_PATH);
      rl.close();
    } catch (err) {
      console.error('Error retrieving access token', err);
    }
  });
}

// אישור OAuth2
async function authorize() {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // אם אין טוקן קיים, ניצור טוקן חדש
  if (!fs.existsSync(TOKEN_PATH)) {
    getNewToken(oAuth2Client);
  } else {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    console.log('Token loaded from file.');
  }
}

authorize();
