const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const clientId = process.env.GOOGLE_CLIENT_ID_EMAILS;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const CREDENTIALS_PATH = path.join(__dirname, 'c:/Users/User/Documents/Scrolls website/server/credentials.json');
const sendWelcomeEmail = async (email, fullName) => {
    const oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'ScrollsSite@gmail.com',
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: 'ScrollsSite@gmail.com',
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    text-align: center;
                }
                h1 {
                    color: #3498db;
                    font-size: 36px;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 18px;
                    color: #555;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    background-color: #3498db;
                    color: #fff;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    margin-top: 20px;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome, ${fullName}!</h1>
                <p>We're excited to have you on board. Thank you for joining our platform. We're here to help you grow and succeed.</p>
                <a href="https://your-platform.com" class="button">Get Started</a>
                <p class="footer">If you didn't sign up, please ignore this email.</p>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully!');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('Missing credentials.json file. Please download it from Google Cloud Console.');
    }
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

const sendEmailWithPDF = async (email, pdfFilePath) => {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'scrollssite@gmail.com',
            clientId: process.env.GOOGLE_CLIENT_ID_EMAILS,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });

    const mailOptions = {
        from: 'scrollsSite@gmail.com',
        to: email,
        subject: 'הקטלוג שלך',
        text: 'שלום! מצורף הקטלוג שביקשת.',
        attachments: [
            {
                filename: 'catalog.pdf',
                path: pdfFilePath,  
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent with PDF attachment!');
    } catch (error) {
        console.error('Error sending email with PDF:', error);
    }
};


module.exports = { sendWelcomeEmail, sendEmailWithPDF };
