const express = require('express');
const router = express.Router();
const { sendEmailWithPDF } = require('../services/emailService');


router.post('/send-catalog', async (req, res) => {
    
    const { pdfData, email } = req.body;

    if (!pdfData || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await sendEmailWithPDF(email, pdfData);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;
