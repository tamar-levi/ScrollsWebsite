const { google } = require('googleapis');
const { sendEmailWithPDF } = require('./emailService');
const { createProductsPDF } = require('./pdfService');

const gmail = google.gmail('v1');

// Function to listen for new emails
async function listenForCatalogEmails(auth) {
    const gmailClient = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmailClient.users.messages.list({
            userId: 'me',
            q: 'subject:קטלוג', 
        });

        const messages = response.data.messages || [];
        if (messages.length === 0) {
            console.log('No catalog emails found.');
            return;
        }

        for (const message of messages) {
            await processMessage(gmailClient, message.id);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

async function processMessage(gmailClient, messageId) {
    try {
        const message = await gmailClient.users.messages.get({
            userId: 'me',
            id: messageId,
        });

        const subject = message.data.payload.headers.find(header => header.name === 'Subject').value;
        console.log(`Processing message with subject: ${subject}`);

        const pdfBuffer = await createProductsPDF();
        await sendEmailWithPDF(pdfBuffer, subject);
    } catch (error) {
        console.error(`Error processing message ID ${messageId}:`, error);
    }
}

async function main() {
    const auth = await authorize(); // Assume authorize() is a function that handles OAuth2 authentication
    await listenForCatalogEmails(auth);
}

main().catch(console.error);
