const { google } = require('googleapis');
const fs = require('fs');
const dotenv = require('dotenv');
const { sendEmailWithPDF } = require('./emailService');

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID_EMAILS;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: refreshToken });

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function checkEmails() {
    try {
        console.log("📬 Checking for catalog requests...");

        // מחפש מיילים עם "catalog" בנושא
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'subject:catalog is:unread'
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log("📭 No new catalog requests found.");
            return;
        }

        for (const message of res.data.messages) {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id
            });

            const headers = msg.data.payload.headers;
            const fromHeader = headers.find(header => header.name === 'From');
            const email = fromHeader ? fromHeader.value.match(/<(.*)>/)[1] : null;

            if (!email) {
                console.warn("⚠️ Could not extract sender email, skipping...");
                continue;
            }

            console.log(`📩 Catalog request from: ${email}`);

            // יצירת PDF ושליחתו
            const pdfPath = await createProductsPDF();
            if (!pdfPath || !fs.existsSync(pdfPath)) {
                throw new Error("❌ PDF file not created properly!");
            }

            const pdfData = fs.readFileSync(pdfPath, 'base64');
            await sendEmailWithPDF(email, pdfData);

            console.log("📧 Catalog email sent successfully!");

            // סימון המייל כנקרא
            await gmail.users.messages.modify({
                userId: 'me',
                id: message.id,
                resource: {
                    removeLabelIds: ['UNREAD']
                }
            });
        }
    } catch (error) {
        console.error("❌ Error retrieving emails:", error.message || error);
    }
}

// בדיקת מיילים כל 30 שניות
setInterval(checkEmails, 30000);
