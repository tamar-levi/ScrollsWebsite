const { google } = require('googleapis');
const readline = require('readline-sync');
const { simpleParser } = require('mailparser');
const { createProductsPDF } = require('./services/pdfService');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send'];

function loadCredentials() {
    if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error('Missing GOOGLE_CREDENTIALS environment variable.');
    }
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
}

async function authorize() {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (process.env.ACCESS_TOKEN && process.env.REFRESH_TOKEN && process.env.EXPIRY_DATE) {
        oAuth2Client.setCredentials({
            access_token: process.env.ACCESS_TOKEN,
            refresh_token: process.env.REFRESH_TOKEN,
            expiry_date: Number(process.env.EXPIRY_DATE),
        });
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

            console.log('🔑 Save these values as environment variables:');
            console.log(`ACCESS_TOKEN=${token.access_token}`);
            console.log(`REFRESH_TOKEN=${token.refresh_token}`);
            console.log(`EXPIRY_DATE=${token.expiry_date}`);

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
            await createProductsPDF(from);
        }

        await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            resource: {
                removeLabelIds: ['UNREAD'],
            },
        });
        console.log('✅ Marked message as read');
    } catch (error) {
        console.error('Error getting message details:', error);
    }
}

async function startListening() {
    const auth = await authorize();
    console.log('✅ Listening for new emails...');
    setInterval(() => listMessages(auth), 60 * 1000);
}

startListening();
