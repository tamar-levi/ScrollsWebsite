const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline-sync');
const SCOPES_SEND = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');

function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('Missing credentials.json file. Please download it from Google Cloud Console.');
    }
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

async function authorize(scopes) {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);
        if (isTokenExpired(token)) {
            console.log('Refreshing access token...');
            await refreshToken(oAuth2Client, token);
        }
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client, scopes);
    }
}

function isTokenExpired(token) {
    const expiryDate = token.expiry_date;
    return expiryDate && expiryDate < Date.now();
}

async function refreshToken(oAuth2Client, token) {
    try {
        const response = await oAuth2Client.refreshToken(token.refresh_token);
        const newToken = {
            access_token: response.tokens.access_token,
            refresh_token: token.refresh_token,
            expiry_date: response.tokens.expiry_date
        };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(newToken));
        oAuth2Client.setCredentials(newToken);
        console.log('Token refreshed successfully!');
    } catch (err) {
        console.error('Error refreshing token:', err);
    }
}

async function getNewToken(oAuth2Client, scopes) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
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
        `לצפייה באתר שלנו: https://www.scrollssite.com`,
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

async function sendReceiptEmail(auth, to, receiptUrl) {
    const subject = 'קבלה עבור תשלום';
    const imagePath = path.join(__dirname, '..', 'images', 'logo.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const contentId = 'logo-image';
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd;">
        <img src="cid:${contentId}" alt="Scrolls Logo" width="100" style="margin-bottom: 8px; display: block;">
        <h2 style="color #555; font-size: 24px;">התשלום שלך התקבל בהצלחה</h2>
        <p style="color: #555; font-size: 16px;">הקבלה שלך זמינה להורדה בלינק הבא:</p>
        <p style="text-align: right;"> <!-- מוזח לימין -->
            <a href="${receiptUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #555; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                הורד את הקבלה כאן
            </a>
        </p>
        <p style="color: #555; font-size: 16px;">אם יש לך שאלות נוספות, ניתן ליצור קשר:</p>
        <p style="color: #333; font-size: 14px;">
            📞 טלפון: 03-1234567<br><br>
            ✉️ מייל: scrollssite@gmail.com
        </p>
         <p style="font-size: 16px; margin: 16px 0;">
                    בקרו באתר שלנו: 
            <a href="https://www.scrollssite.com/products" style="color:rgb(12, 12, 12); text-decoration: none;">www.scrollssite.com</a>
        </p>
        <p style="color: #888; font-size: 12px; text-align: center;">
            הודעה זו נשלחה באופן אוטומטי, אין צורך להשיב אליה.
        </p>
    </div>`;

    const rawMessage = [
        `From: "scrollssite@gmail.com"`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/related; boundary="boundary_1"`,
        ``,
        `--boundary_1`,
        `Content-Type: text/html; charset="UTF-8"`,
        ``,
        htmlBody,
        ``,
        `--boundary_1`,
        `Content-Type: image/png; name="logo.png"`,
        `Content-Transfer-Encoding: base64`,
        `Content-ID: <${contentId}>`,
        ``,
        imageBase64,
        `--boundary_1--`
    ].join("\r\n");

    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: Buffer.from(rawMessage).toString('base64')
            }
        });
        console.log('✅ קבלה נשלחה בהצלחה:', res.data);
    } catch (err) {
        console.error('❌ שגיאה בשליחת הקבלה:', err);
    }
}

async function sendWelcomeEmail(auth, email) {
    const subject = 'ברוך הבא ללוח המגילות 📜';
    const imagePath = path.join(__dirname, '..', 'images', 'logo.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const contentId = 'logo-image';
    const htmlBody = `
    <div style="background-color: #f4f4f4; padding: 40px; text-align: center;">
      <table align="center" width="600" style="background: #ffffff; border-radius: 10px; padding: 30px; font-family: Arial, sans-serif; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <tr>
              <td align="center">
                  <img src="cid:${contentId}" alt="Scrolls Logo" width="100" style="margin-bottom: 8px;">
                  <h2 style="color: #4E3629;">ברוך הבא ללוח המגילות</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                      .לוח המגילות הוא מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם&nbsp;<br>
                      הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה לרוכשים ולסופרים&nbsp;<br>
                      הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף הדיו והכתיבה עצמה, וכלה בהגהה ותיקון&nbsp;<br><br>
                      אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה, תוכלו לפנות אלינו במספר 0527672693 או במייל<br><br>
                      <strong style="color: #555; font-size: 16px;">ScrollsSite@gmail.com</strong>
                  </p>
                  <p style="font-size: 16px; margin: 16px 0;">
                    בקרו באתר שלנו: 
                    <a href="https://www.scrollssite.com" style="color:rgb(12, 12, 12); text-decoration: none;">www.scrollssite.com</a>
                  </p>
                  <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
                  <p style="color: #888; font-size: 12px;">
                      הודעה זו נשלחה באופן אוטומטי, אין צורך להשיב אליה.
                  </p>
              </td>
          </tr>
      </table>
    </div>
  `;
  

    const rawMessage = [
        `From: "scrollssite@gmail.com"`,
        `To: ${email}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/related; boundary="boundary_1"`,
        ``,
        `--boundary_1`,
        `Content-Type: text/html; charset="UTF-8"`,
        ``,
        htmlBody,
        `--boundary_1`,
        `Content-Type: image/png; name="logo.png"`,
        `Content-Transfer-Encoding: base64`,
        `Content-ID: <${contentId}>`,
        ``,
        imageBase64,
        `--boundary_1--`
    ].join("\r\n");

    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: Buffer.from(rawMessage).toString('base64')
        }
    });

    console.log('✅ Welcome email sent successfully:', res.data);
}

async function getAuth() {
    const auth = await authorize(SCOPES_SEND);  
    if (!(auth instanceof google.auth.OAuth2)) {
        throw new Error('The auth object is not an instance of OAuth2Client.');
    }
    return auth; 
}

async function sendEmailExample() {
    const auth = await getAuth();
    await sendReceiptEmail(auth, 'HAD4059@gmail.com', 'loclhost:3000');
}

module.exports = {
    getAuth, sendEmail, sendWelcomeEmail, sendReceiptEmail
};