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
        const imageBuffer = Buffer.from(imageBase64, "base64");

        const resizedImage = await sharp(imageBuffer)
            .resize({ width: 300 })
            .toFormat("webp", { quality: 80 })
            .toBuffer();

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
                user: {
                    fullName: product.userId.fullName,
                    email: product.userId.email,
                    phoneNumber: product.userId.phoneNumber !== '0' ? product.userId.phoneNumber : 'לא צוין',
                    city: product.userId.city
                }
            };
        }));
    } catch (err) {
        console.error("Error fetching products", err);
        return [];
    }
};


const generateHTML = (products) => {
    const templateSource = fs.readFileSync("templates/productTemplate.hbs", "utf8");
    const template = Handlebars.compile(templateSource);
    return template({ products });
};

const generatePDF = async (html) => {
    console.log("HTML size:", html.length);
    try {
        const response = await axios.post("https://api.pdfshift.io/v3/convert/pdf", {
            source: html,
        }, {
            username: 'api', password: "sk_e3f8be6892a7bc6198947058a42813d7739550c9",
            responseType: "arraybuffer",
        });

        const filePath = path.join(__dirname, 'products.pdf');
        fs.writeFileSync(filePath, response.data);
        console.log("📄 PDF created successfully!");
        return filePath;
    } catch (err) {
        console.error("❌ Error creating PDF", err);
        throw err;
    }
};

const createProductsPDF = async (email) => {
    await connectDB();
    const products = await getAllProducts();
    const html = generateHTML(products);
    const pdf = await generatePDF(html);
    console.log('📤 Sending email with PDF...');
    const auth = await authorize();
    await sendEmail(auth, email, pdf);
};

module.exports = {
    createProductsPDF
};