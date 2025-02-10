const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const MOSAD_NUMBER = process.env.MOSAD_NUMBER;
const API_PASSWORD = process.env.API_PASSWORD;
const clientId = process.env.GOOGLE_CLIENT_ID_EMAILS;
const clientSecret = process.env.GOOGLE_CLIENT_SECERT;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

// פונקציה לשליחת מייל עם קבלה
const sendReceiptEmail = async (email, receiptUrl) => {
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
        from: 'scrollssite@gmail.com',
        to: email,
        subject: 'קבלה על התשלום',
        text: `תודה על התשלום!\nניתן לצפות בקבלה בקישור הבא: ${receiptUrl}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📩 קבלה נשלחה בהצלחה');
    } catch (error) {
        console.error('❌ שגיאה בשליחת הקבלה:', error);
    }
};

// פונקציה לקבלת קישור לקבלה מנדרים פלוס
const getReceiptUrl = async (transactionId) => {
    try {
        const response = await axios.get('https://matara.pro/nedarimplus/Reports/Tamal3.aspx', {
            params: {
                Action: 'ShowInvoice',
                MosadNumber: MOSAD_NUMBER,
                ApiPassword: API_PASSWORD,
                TransactionId: transactionId
            }
        });

        if (response.data.Result === 'OK') {
            return response.data.Message; // קישור לקבלה
        } else {
            console.error('⚠️ שגיאה בקבלת הקבלה:', response.data.Message);
            return null;
        }
    } catch (error) {
        console.error('❌ שגיאה בבקשה לקבלת קבלה:', error);
        return null;
    }
};

// פונקציה לטיפול בקאלבק מנדרים פלוס
const handlePaymentCallback = async (req, res) => {
    try {
        const paymentData = req.body; // הנתונים שהתקבלו מנדרים פלוס
        console.log('🔄 קיבלנו קאלבק:', paymentData);

        if (paymentData.Status === 'success') {
            console.log(`✅ תשלום הצליח! מספר עסקה: ${paymentData.TransactionId}`);

            // קבלת קישור קבלה
            const receiptUrl = await getReceiptUrl(paymentData.TransactionId);
            if (receiptUrl) {
                console.log(`📄 קישור לקבלה: ${receiptUrl}`);
                await sendReceiptEmail(paymentData.Mail, receiptUrl);
            }
        } else {
            console.log('❌ תשלום נכשל או לא הושלם');
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('❌ שגיאה בטיפול בקאלבק:', error);
        res.status(500).send('Error processing payment callback');
    }
};

module.exports = { handlePaymentCallback };
