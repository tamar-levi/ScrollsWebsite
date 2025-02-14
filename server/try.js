const { sendEmailWithPDF } = require('./services/emailService');  
const email = 'had4059@gmail.com';
sendEmailWithPDF(email, 'c:/Users/User/Documents/Scrolls website/server/products.pdf');
