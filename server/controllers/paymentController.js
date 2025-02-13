const axios = require('axios');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const MOSAD_NUMBER = process.env.MOSAD_NUMBER;
const API_PASSWORD = process.env.API_PASSWORD;
const clientId = process.env.GOOGLE_CLIENT_ID_EMAILS;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

// יצירת OAuth2 לקוח
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
oauth2Client.setCredentials({ refresh_token: refreshToken });

// פונקציה לקבלת accessToken מעודכן
const getAccessToken = async () => {
    try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error("❌ שגיאה בקבלת accessToken:", error);
        return null;
    }
};

// פונקציה לשליחת מייל עם קבלה
const sendReceiptEmail = async (email, receiptUrl) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error("❌ אין accessToken תקף, לא ניתן לשלוח מייל.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "ScrollsSite@gmail.com",
            clientId,
            clientSecret,
            refreshToken,
            accessToken,
        },
    });

    const mailOptions = {
        from: '"ScrollsSite" <scrollssite@gmail.com>',
        to: email,
        subject: "קבלה על התשלום",
        text: `תודה על התשלום!\nניתן לצפות בקבלה בקישור  ${receiptUrl}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📩 קבלה נשלחה בהצלחה ל-", email);
    } catch (error) {
        console.error("❌ שגיאה בשליחת הקבלה:", error);
    }
};

// פונקציה לקבלת קישור לקבלה מנדרים פלוס
const getReceiptUrl = async (transactionId) => {
    try {
        const response = await axios.get("https://matara.pro/nedarimplus/Reports/Tamal3.aspx", {
            params: {
                Action: "ShowInvoice",
                MosadNumber: MOSAD_NUMBER,
                ApiPassword: API_PASSWORD,
                TransactionId: transactionId,
            },
        });

        if (response.data && response.data.Result === "OK") {
            return response.data.Message; // קישור לקבלה
        } else {
            console.error("⚠️ שגיאה בקבלת הקבלה:", response.data?.Message || "תגובה לא תקינה מהשרת");
            return null;
        }
    } catch (error) {
        console.error("❌ שגיאה בבקשה לקבלת קבלה:", error);
        return null;
    }
};

// פונקציה לטיפול בקאלבק מנדרים פלוס
const handlePaymentCallback = async (req, res) => {
    try {
        const paymentData = req.body; // הנתונים שהתקבלו מנדרים פלוס
        console.log("🔄 קיבלנו קאלבק:", paymentData);

        if (paymentData.Status === "success") {
            console.log(`✅ תשלום הצליח! מספר עסקה: ${paymentData.TransactionId}`);

            // קבלת קישור קבלה
            const receiptUrl = await getReceiptUrl(paymentData.TransactionId);
            if (receiptUrl) {
                console.log(`📄 קישור לקבלה: ${receiptUrl}`);
                await sendReceiptEmail(paymentData.Mail, receiptUrl);
            }
        } else {
            console.log("❌ תשלום נכשל או לא הושלם");
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("❌ שגיאה בטיפול בקאלבק:", error);
        res.status(500).send("Error processing payment callback");
    }
};

module.exports = { handlePaymentCallback };
