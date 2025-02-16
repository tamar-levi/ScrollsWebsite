const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline-sync');

// הגדרת הסקופ לשליחה
const SCOPES_SEND = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
const CREDENTIALS_PATH = 'C:/Users/User/Documents/Scrolls website/server/credentials.json';
const TOKEN_PATH = 'C:/Users/User/Documents/Scrolls website/server/token.json';

// פונקציה להורדת ה-Credentials
function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('Missing credentials.json file. Please download it from Google Cloud Console.');
    }
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

// פונקציה לאימות גישה ל-Gmail עם רענון אוטומטי של טוקן במידת הצורך
async function authorize(scopes) {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);

        // בדוק אם הטוקן פג וחדש אותו אוטומטית אם צריך
        if (isTokenExpired(token)) {
            console.log('Refreshing access token...');
            await refreshToken(oAuth2Client, token);
        }
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client, scopes);
    }
}

// פונקציה לבדוק אם הטוקן פג
function isTokenExpired(token) {
    const expiryDate = token.expiry_date;
    return expiryDate && expiryDate < Date.now();
}

// פונקציה לרענן את הטוקן
async function refreshToken(oAuth2Client, token) {
    try {
        const newToken = await oAuth2Client.refreshAccessToken();
        token.access_token = newToken.credentials.access_token;
        token.expiry_date = newToken.credentials.expiry_date;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token refreshed successfully!');
    } catch (err) {
        console.error('Error refreshing token:', err);
    }
}

// יצירת טוקן חדש אם אין טוקן קיים
async function getNewToken(oAuth2Client, scopes) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
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

// פונקציה לשליחת מייל ברוך הבא
async function sendWelcomeEmail(auth, email) {
    const subject = 'ברוך הבא ללוח המגילות 📜';
    const imagePath = 'c:/Users/User/Documents/Scrolls website/server/images/logo.png';
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
                    הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן לרוכשים ולסופרים&nbsp;<br>
                    הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף הדיו והכתיבה עצמה, וכלה בהגהה ותיקון&nbsp;<br><br>
                    אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה, תוכלו לפנות אלינו במספר 0527672693 או במייל<br><br>
                    <strong style="color: #555; font-size: 16px;">ScrollsSite@gmail.com</strong>
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
    const auth = await authorize(SCOPES_SEND);  // מבצע את האותנטיקציה באמצעות authorize
    if (!(auth instanceof google.auth.OAuth2)) {
        throw new Error('The auth object is not an instance of OAuth2Client.');
    }
    return auth;  // מחזיר את אובייקט האותנטיקציה
}

// פונקציה שמקבלת גישה ואז שולחת מייל דוגמה
async function sendEmailExample() {
    const auth = await getAuth();
    const attachmentPath = 'c:/Users/User/Documents/Scrolls website/server/products.pdf';
    await sendEmail(auth, 'Rachel0583202634@gmail.com', attachmentPath);
    await sendWelcomeEmail(auth,  'T0527144636@gmail.com');
}

module.exports = {
    getAuth, sendEmail, sendWelcomeEmail
};
