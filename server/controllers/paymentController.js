const axios = require('axios');
require('dotenv').config();
const { sendReceiptEmail, authorize } = require('../services/emailService');
const MOSAD_NUMBER = process.env.MOSAD_NUMBER;
const API_PASSWORD = process.env.API_PASSWORD;

const getReceiptUrl = async (transactionId) => {
    try {
        const response = await axios.get("https://matara.pro/nedarimplus/Reports/Tamal3.aspx", {
            params: {
                Action: "ShowInvoice",
                MosadNumber: MOSAD_NUMBER,
                ApiPassword: API_PASSWORD,
                TransactionId: transactionId,
                TamalType: 400
            },
        });
        console.log("✅ Response Data:", response);
        if (response.data == "OK") {
            return response.data.Message; 
        } else {
            console.error("⚠️ Error getting receipt:", response.data?.Message || "Invalid server response");
            return null;
        }
    } catch (error) {
        console.error("❌ Error in receipt request:", error);
        return null;
    }
};

const handlePaymentCallback = async (req, res) => {
    try {
        const paymentData = req.body; 
        console.log("🔄 Received callback:", paymentData);
        if (paymentData.Status == "OK") {
            console.log(`✅ Payment successful! Transaction ID: ${paymentData.TransactionId}`);
            const receiptUrl = await getReceiptUrl(paymentData.TransactionId);
            if (receiptUrl) {
                console.log(`📄 Receipt URL: ${receiptUrl}`);
                const auth = await authorize();
                await sendReceiptEmail(auth, paymentData.Mail, receiptUrl);
            }
        } else {
            console.log("❌ Payment failed or incomplete");
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("❌ Error handling callback:", error);
        res.status(500).send("Error processing payment callback");
    }
};

module.exports = { handlePaymentCallback };
