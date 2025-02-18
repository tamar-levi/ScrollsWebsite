const axios = require('axios');
require('dotenv').config();
const { sendReceiptEmail, getAuth } = require('../services/emailService');
const MOSAD_NUMBER = process.env.MOSAD_NUMBER;
const API_PASSWORD = process.env.API_PASSWORD;

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
            return response.data.Message; 
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
        const paymentData = req.body; 
        console.log("🔄 קיבלנו קאלבק:", paymentData);

        if (paymentData.Status === "success") {
            console.log(`✅ תשלום הצליח! מספר עסקה: ${paymentData.TransactionId}`);
            const receiptUrl = await getReceiptUrl(paymentData.TransactionId);
            if (receiptUrl) {
                console.log(`📄 קישור לקבלה: ${receiptUrl}`);
                const auth = await getAuth();
                await sendReceiptEmail(auth, paymentData.Mail, receiptUrl);
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
