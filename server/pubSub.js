const { google } = require('googleapis');
const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs');
const nodemailer = require('nodemailer');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const { sendEmailWithPDF } = require('./services/emailService');
const {createProductsPDF} = require('./services/pdfService');
const pubSubClient = new PubSub();
const clientId = process.env.GOOGLE_CLIENT_ID_EMAILS;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const emailSender = "ScrollsSite@gmail.com";
const topicName = 'projects/scrollssite/topics/email-catalog-request';
const subscriptionName = 'email-catalog-subscription';

const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: refreshToken
});

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',        
    'https://www.googleapis.com/auth/gmail.readonly',    
    'https://www.googleapis.com/auth/gmail.modify'       
];

oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        console.log("🔄 Received new Refresh Token:", tokens.refresh_token);
    }
    console.log("🔄 Received new Access Token:", tokens.access_token);
    oauth2Client.setCredentials(tokens);
});

async function checkAccessToken() {
    try {
        const { token } = await oauth2Client.getAccessToken();
        if (!token) throw new Error("The received Access Token is empty!");
        console.log("✅ Access Token successfully received:", token);
    } catch (error) {
        console.error("❌ Error receiving Access Token:", error.message );
        console.error("Full error:", error.response?.data || error);
        process.exit(1);
    }
}

checkAccessToken();
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function validateGmailAuth() {
    try {
        const res = await gmail.users.getProfile({ userId: 'me' });
        console.log("✅ Authentication successful - Gmail connected properly:", res.data.emailAddress);
    } catch (error) {
        console.error("❌ Error authenticating with Gmail API:", error.response?.data || error);
        process.exit(1);
    }
}

validateGmailAuth();

const listenForMessages = () => {
    const subscription = pubSubClient.subscription(subscriptionName);
    console.log('👂 Starting to listen for messages on Subscription:', subscriptionName);

    subscription.on('message', async (message) => {
        console.log("📩 Message received!");
        try {
            const messageData = JSON.parse(message.data.toString());
            console.log("📥 Message data:", messageData);

            const { email, subject } = messageData;

            if (!email || typeof email !== 'string') {
                throw new Error("❌ Missing or invalid email address!");
            }

            if (!subject || typeof subject !== 'string') {
                throw new Error("❌ Missing or invalid subject!");
            }

            if (!subject.toLowerCase().includes('catalog')) {
                console.log("⚠️ The email is not a catalog request, ignoring.");
                message.ack();
                return;
            }

            console.log("📧 Sending catalog email to:", email);
            const pdfPath = await createProductsPDF();
            if (!pdfPath || !fs.existsSync(pdfPath)) {
                throw new Error("❌ PDF file not created properly!");
            }

            const pdfData = fs.readFileSync(pdfPath, 'base64');
            await sendEmailWithPDF(email, pdfData);

            console.log("📧 Catalog email sent successfully!");
            message.ack();
        } catch (error) {
            console.error("❌ Error processing the message:", error.message || error);
            message.nack();
        }
    });

    subscription.on('error', (err) => {
        console.error("❌ Error listening for messages:", err);
    });
};

setInterval(() => {
    console.log("🔄 Checking for new messages...");
    listenForMessages();
}, 30000); 