const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline-sync');
const { simpleParser } = require('mailparser');
const { createProductsPDF } = require('./services/pdfService');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('Missing credentials.json file. Please download it from Google Cloud Console.');
    }
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

async function authorize() {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client);
    }
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this URL:', authUrl);

    const code = readline.question('Enter the code from the page: ');
    return new Promise((resolve, reject) => {
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return reject('Error retrieving access token: ' + err);
            oAuth2Client.setCredentials(token);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token saved to', TOKEN_PATH);
            resolve(oAuth2Client);
        });
    });
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
        console.log(`📜 Snippet: ${message.snippet}`);
        console.log('---------------------------------------');

        if (subject && subject.toLowerCase().includes('קטלוג')) {
            console.log('🔔 Catalog email detected! Generating PDF...');
            const pdf = await createProductsPDF(from);
        }
    } catch (error) {
        console.error('Error getting message details:', error);
    }
}

async function startListening() {
    const auth = await authorize();
    console.log('✅ Listening for new emails...');
    setInterval(() => listMessages(auth), 30 * 1000);
}

startListening();