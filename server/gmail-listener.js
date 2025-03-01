const { google } = require('googleapis');
const readline = require('readline-sync');
const { simpleParser } = require('mailparser');
const { sendPDFEmail } = require('./services/pdfService');
const fs = require('fs');
const path = require('path');
const SCOPES_SEND = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, 'token.json');

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
        const response = await oAuth2Client.refreshToken(token.refresh_token);
        const newToken = {
            access_token: response.tokens.access_token,
            refresh_token: token.refresh_token,
            expiry_date: response.tokens.expiry_date
        };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(newToken));
        console.log('Token refreshed successfully!');
        oAuth2Client.setCredentials(newToken);
    } catch (err) {
        console.error('Error refreshing token:', err);
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
        throw new Error('Error retrieving access token: ' + err);
    }
}


async function listMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            q: 'is:unread',
        });
        const messages = res.data.messages || [];
        if (messages.length === 0) {
            console.log('No new messages.');
            return;
        }
        console.log(`Found ${messages.length} new message(s):`);
        for (const message of messages) {
            await getMessageDetails(gmail, message.id);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

async function getMessageDetails(gmail, messageId) {
    try {
        const res = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
        });
        const message = res.data;
        const headers = message.payload.headers;
        const from = headers.find(header => header.name === 'From')?.value || 'Unknown sender';
        const subject = headers.find(header => header.name === 'Subject')?.value || 'No subject';

        const rawEmail = Buffer.from(message.payload.body?.data || '', 'base64').toString('utf-8');
        const parsed = await simpleParser(rawEmail);

        console.log(`📩 From: ${from}`);
        console.log(`📌 Subject: ${subject}`);
        console.log('---------------------------------------');

        if (subject && subject.toLowerCase().includes('קטלוג')) {
            console.log('🔔 Catalog email detected! Generating PDF...');
            await sendPDFEmail(from);
            await gmail.users.messages.modify({
                userId: 'me',
                id: messageId,
                resource: {
                    removeLabelIds: ['UNREAD'],
                },
            });
            console.log('✅ Marked message as read');
        }

    } catch (error) {
        console.error('Error getting message details:', error);
    }
}

async function startListening() {
    const auth = await authorize();
    console.log('✅ Listening for new emails...');
    setInterval(() => listMessages(auth), 300 * 1000);
}

startListening();
