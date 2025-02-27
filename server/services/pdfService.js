const fs = require("fs");
const axios = require("axios");
const Handlebars = require("handlebars");
const Product = require("../models/productModel");
const User = require('../models/userModel');
const mongoose = require('mongoose')
require('dotenv').config();
const { sendEmail, authorize } = require('./emailService');
const path = require('path');
const sharp = require("sharp");
const api_key = 'sk_ccc7601203466efc85b20a8b1e77a92c46c02341';
const { minify } = require('html-minifier');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    }
};

const processImage = async (imageBase64) => {
    try {
        // המרת ה-B64 לבופר
        const imageBuffer = Buffer.from(imageBase64, "base64");

        // קבלת מידע על התמונה (כדי להחליט על איכות דינמית)
        const metadata = await sharp(imageBuffer).metadata();

        // קביעת איכות דינמית על פי גודל התמונה
        let quality = 80;  // ברירת מחדל
        if (metadata.size > 1000000) { // אם התמונה מעל 1MB
            quality = 60;  // איכות נמוכה יותר
        } else if (metadata.size > 500000) { // אם התמונה בין 500KB ל-1MB
            quality = 70;  // איכות בינונית
        }

        // כיווץ התמונה לפי פורמט WebP או JPEG (על פי גודל התמונה)
        const resizedImage = await sharp(imageBuffer)
            .resize({ width: 300 })  // גודל יעד ברוחב 300 (אתה יכול לשנות זאת)
            .webp({ quality: quality })  // שימוש ב-WebP עם האיכות שנבחרה
            .toBuffer();

        // החזרת התמונה המכווצת כ-B64
        return `data:image/webp;base64,${resizedImage.toString("base64")}`;
        
    } catch (err) {
        console.error("❌ Error processing image", err);
        return null;
    }
};


const getAllProducts = async () => {
    try {
        const products = await Product.find().populate('userId', 'fullName email phoneNumber city');

        return await Promise.all(products.map(async (product) => {
            const processedImage = await processImage(product.primaryImage);
            
            return {
                scriptType: product.scriptType,
                price: product.price,
                scrollType: product.scrollType,
                note: product.note,
                primaryImage: processedImage, 
                isPremiumAd: product.isPremiumAd,
                user: {
                    fullName: product.userId.fullName,
                    email: product.userId.email,
                    phoneNumber: product.userId.phoneNumber !== '0' ? product.userId.phoneNumber : 'לא צוין',
                    city: product.userId.city
                }
            };
        }));
    } catch (err) {
        console.error("Error fetching products");
        return [];
    }
};


const generateHTML = (products) => {
    const templateSource = fs.readFileSync("templates/productTemplate.hbs", "utf8");
    const template = Handlebars.compile(templateSource);
    return template({ products });
};

const generatePDF = async (html) => {
    const minifiedHTML = minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
    });
    console.log("Minified HTML size:", minifiedHTML.length);
    console.log("Minified HTML size in bytes:", Buffer.byteLength(minifiedHTML, 'utf8'));
    try {
        const response = await axios.post('https://api.pdfshift.io/v3/convert/pdf', {
            source: minifiedHTML,
            auth: {
                username: 'api',
                password: api_key
            },
            responseType: 'arraybuffer',
        });

        const filePath = path.join(__dirname, 'products.pdf');
        fs.writeFileSync(filePath, response.data);
        console.log("📄 PDF created successfully!");

        // קבלת גודל הקובץ שנשמר
        const stats = fs.statSync(filePath);
        console.log("File size:", stats.size, "bytes"); // יראה את הגודל בבייטים

        return filePath;
    } catch (err) {
        console.error("❌ Error creating PDF");
    }
};


const createProductsPDF = async (email) => {
    await connectDB();
    let products = await getAllProducts();
    products = products.sort((a, b) => b.isPremiumAd - a.isPremiumAd);
    const html = generateHTML(products);
    const pdf = await generatePDF(html);
    console.log('📤 Sending email with PDF...');
    const auth = await authorize();
    await sendEmail(auth, email, pdf);
};


module.exports = {
    createProductsPDF
};