const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs');
const pubSubClient = new PubSub();
const { sendEmailWithPDF } = require('./emailService');  

const subscriptionName = 'email-catalog-subscription'; 

const listenToCatalogRequests = () => {
    const subscription = pubSubClient.subscription(subscriptionName);

    const messageHandler = async (message) => {
        try {
            const messageData = JSON.parse(message.data.toString());

            console.log("📩 התקבלה הודעה: ", messageData);

            const { email, subject } = messageData;

            if (!email) {
                console.error("❌ כתובת מייל חסרה בהודעה");
                message.ack(); 
                return;
            }

            if (!subject || !subject.toLowerCase().includes('קטלוג')) {
                console.log("⚠️ המייל אינו בקשת קטלוג, מתעלם.");
                message.ack();
                return;
            }

            console.log(`📩 קיבלת בקשה חדשה מקטלוג מכתובת: ${email}`);

            // קריאה לקובץ ה-PDF
            const pdfPath = 'products.pdf';  
            if (!fs.existsSync(pdfPath)) {
                console.error("❌ קובץ PDF לא נמצא!");
                message.ack();
                return;
            }

            const pdfData = fs.readFileSync(pdfPath, 'base64');

            await sendEmailWithPDF(email, pdfData);
            console.log("📧 מייל עם קטלוג נשלח בהצלחה!");

        } catch (error) {
            console.error("❌ שגיאה בטיפול בהודעה:", error);
        }

        message.ack(); 
    };

    subscription.on('message', messageHandler); 
};

listenToCatalogRequests();
