const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline-sync');
const SCOPES_SEND = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, '..', 'token.json');

async function authorize() {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    let token;
    try {
        token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    } catch (err) {
        console.log('Token not found or expired, requesting a new one...');
        return getNewToken(oAuth2Client);
    }

    if (token.access_token) {
        oAuth2Client.setCredentials(token);
        if (isTokenExpired(token)) {
            console.log('Refreshing access token...');
            await refreshToken(oAuth2Client, token);
        }
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client);
    }
}

function isTokenExpired(token) {
    const expiryDate = token.expiry_date;
    return expiryDate && expiryDate < Date.now();
}

async function refreshToken(oAuth2Client, token) {
    try {
        const { credentials } = await oAuth2Client.refreshAccessToken();
        const newToken = {
            access_token: credentials.access_token,
            refresh_token: token.refresh_token,
            expiry_date: credentials.expiry_date
        };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(newToken));
        console.log('✅ Token refreshed successfully!');
        oAuth2Client.setCredentials(newToken);
    } catch (err) {
        console.error('❌ Error refreshing token:', err);
    }
}


async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES_SEND
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    const code = readline.question('Enter the code from the page: ');
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        const tokenData = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date
        };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData));
        console.log('Token saved successfully!');
        return oAuth2Client;
    } catch (err) {
        throw new Error('Error retrieving access token: ' + err.message);
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
        `Content-Type: text/html; charset=UTF-8`,
        "",
        `<div dir="rtl" style="text-align: right;">
        <p>לצפייה באתר שלנו / להוספת מגילה:</p>
        <p><a href="https://scrolls-website.vercel.app">https://scrolls-website.vercel.app</a></p>
        <p>המאגר מתעדכן כל הזמן</p>
        </div>`,
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
        <p style="color: #333; font-size: 14px;">
            📞 טלפון: 03-1234567<br><br>
            ✉️ מייל: scrollssite@gmail.com
        </p>
         <p style="font-size: 16px; margin: 16px 0;">
            בקרו באתר שלנו: 
             <br>
            <a href="https://scrolls-website.vercel.app/products" style="color:rgb(12, 12, 12); text-decoration: none;">https://scrolls-website.vercel.app</a>
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
        console.log('✅ Email with receipt sent successfully.', res.data);
    } catch (err) {
        console.error('❌ Error sending receipt:', err);
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
                      לוח המגילות הוא מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם&nbsp;<br>
                      הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה לרוכשים ולסופרים&nbsp;<br>
                      הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף הדיו והכתיבה עצמה, וכלה בהגהה ותיקון&nbsp;<br><br>
                      אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה, תוכלו לפנות אלינו במספר 0527672693 או במייל<br><br>
                      <strong style="color: #555; font-size: 16px;">ScrollsSite@gmail.com</strong>
                  </p>
                  <p style="font-size: 16px; margin: 16px 0;">
                   בקרו באתר שלנו: 
                     <br>
                     <a href="https://scrolls-website.vercel.app" style="color:rgb(12, 12, 12); text-decoration: none;">https://scrolls-website.vercel.app</a>
                  </p>
                  <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
                  <p style="color: #888; font-size: 12px;">
                      הודעה זו נשלחה באופן אוטומטי, אין צורך להשיב אליה.
                  </p>
              </td>
          </tr>
      </table>
    </div>`;

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
        console.log('✅ Welcome email sent successfully:', res.data);
    } catch (err) {
        console.error('❌ Error sending welcome email:', err);
    }
}

async function sendContactEmail(auth, fromEmail, subject = 'אין נושא', content = 'אין תוכן') {
    console.log(fromEmail, subject, content);
    const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h4>הודעה חדשה מ: ${fromEmail}</h4>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>תוכן ההודעה:</strong></p>
            <p>${content}</p>
        </div>
    </div>`;

    const rawMessage = [
        'From: "Scrolls Site" <scrollssite@gmail.com>',
        'To: "Scrolls Site" <scrollssite@gmail.com>',
        `Reply-To: ${fromEmail}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        htmlBody
    ].join('\r\n');

    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: Buffer.from(rawMessage).toString('base64')
            }
        });
        console.log('✅ המייל נשלח בהצלחה:', res.data);
        return true;
    } catch (err) {
        console.error('❌ שגיאה בשליחת המייל:', err);
        throw err;
    }
}

async function sendExampleEmail() {
    const auth = await authorize();
    const email = 'had4059@gmail.com';
    sendWelcomeEmail(auth, email);
}

module.exports = { sendEmail, sendReceiptEmail, sendWelcomeEmail, authorize, sendContactEmail };