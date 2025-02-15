const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline-sync');

// הגדרת הסקופ לשליחה
const SCOPES_SEND = ['https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = 'c:/Users/User/Documents/Scrolls website/server/credentials.json';
const TOKEN_PATH = 'c:/Users/User/Documents/Scrolls website/server/token.json';

// פונקציה להורדת ה-Credentials
function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('Missing credentials.json file. Please download it from Google Cloud Console.');
    }
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

// פונקציה לאימות גישה ל-Gmail
async function authorize(scopes) {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client, scopes);
    }
}

// יצירת טוקן חדש אם אין טוקן קיים
async function getNewToken(oAuth2Client, scopes) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // חשוב לאפשר "offline" כדי לקבל את ה-refresh token
        scope: scopes
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    const code = readline.question('Enter the code from the page: ');
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token saved to', TOKEN_PATH);
        return oAuth2Client;
    } catch (err) {
        throw new Error('Error retrieving access token: ' + err);
    }
}

// יצירת הודעת raw עם קובץ מצורף
function createRawMessage(to, subject, attachmentPath) {
    const boundary = "__boundary__";
    
    const attachment = fs.readFileSync(attachmentPath).toString('base64');
    
    const encodedSubject = Buffer.from(subject, 'utf-8').toString('base64');
    const encodedFileName = Buffer.from("קטלוג מגילות.pdf", 'utf-8').toString('base64');

    let message = [
        `From: "scrollssite@gmail.com"`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${encodedSubject}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        `Content-Type: text/plain; charset=UTF-8`,
        "",
        `--${boundary}`,
        `Content-Type: application/pdf; name="=?UTF-8?B?${encodedFileName}?="`,
        `Content-Disposition: attachment; filename="=?UTF-8?B?${encodedFileName}?="`,
        `Content-Transfer-Encoding: base64`,
        "",
        attachment,
        `--${boundary}--`
    ].join("\r\n");

    return new Buffer.from(message).toString('base64');
}

// שליחת המייל באמצעות Gmail API
async function sendEmail(auth, email, attachmentPath) {
    const rawMessage = createRawMessage(email, 'קטלוג מוצרים לוח המגילות', attachmentPath);

    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: rawMessage
        }
    });
    console.log('✅ Email sent successfully:', res.data);
}

// פונקציה שמחזירה את ה-OAuth2Client
async function getAuth() {
    const auth = await authorize(SCOPES_SEND);
    if (!(auth instanceof google.auth.OAuth2)) {
        throw new Error('The auth object is not an instance of OAuth2Client.');
    }
    return auth;
}

// דוגמה לשליחה
async function sendEmailExample() {
    const auth = await getAuth(); 
    const attachmentPath = 'c:/Users/User/Documents/Scrolls website/server/products.pdf'; 
    await sendEmail(auth, 'Rachel0583202634@gmail.com', attachmentPath);
}

module.exports = {
    getAuth, sendEmail
};