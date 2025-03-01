const fs = require("fs");
const axios = require("axios");
const Handlebars = require("handlebars");
const Product = require("../models/productModel");
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { sendEmail, authorize } = require('./emailService');
const path = require('path');
const sharp = require("sharp");
const { minify } = require('html-minifier');
const { PDFDocument } = require('pdf-lib'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB', err);
        process.exit(1);
    }
};

const processImage = async (imageBase64) => {
    try {
        const imageBuffer = Buffer.from(imageBase64, "base64");
        const metadata = await sharp(imageBuffer).metadata();
        
        let quality = 80;  
        if (metadata.size > 1000000) { 
            quality = 60;
        } else if (metadata.size > 500000) {
            quality = 70;
        }

        const resizedImage = await sharp(imageBuffer)
            .resize({ width: 300 })  
            .webp({ quality: quality }) 
            .toBuffer();

        return `data:image/webp;base64,${resizedImage.toString("base64")}`;
    } catch (err) {
        console.error("❌ Error processing image", err);
        return null;
    }
};

const getAllProducts = async () => {
    try {
        const products = await Product.find({}, '-additionalImages').populate('userId', 'fullName email phoneNumber city');
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
        console.error("❌ Error fetching products", err);
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

    try {
        console.log("Minified HTML size:", minifiedHTML.length); 
        const response = await axios.post('https://api.pdfshift.io/v3/convert/pdf', {
            source: minifiedHTML,
        }, {
            auth: {
                username: 'api',
                password: 'sk_ccc7601203466efc85b20a8b1e77a92c46c02341'
            },
            responseType: 'arraybuffer',
        });

        if (response.status === 200) {
            const fileName = `products_${Date.now()}.pdf`; 
            const filePath = path.join(__dirname, fileName);
            fs.writeFileSync(filePath, response.data);
            console.log("📄 PDF created successfully!");
            return filePath;
        } else {
            console.error(`❌ Error: Received status code ${response.status} - ${response.statusText}`);
            return null;
        }
    } catch (err) {
        if (err.response) {
            console.error(`❌ Error: Status ${err.response.status} - ${err.response.statusText}`);
            if (err.response.data && err.response.data.error) {
                console.error(`Error details: ${err.response.data.error}`);
            }
        } else {
            console.error(`❌ Error: ${err.message}`);
        }
        return null;
    }
};


const createProductsPDF = async () => {
    await connectDB();
    let products = await getAllProducts();
    products = products.sort((a, b) => b.isPremiumAd - a.isPremiumAd);

    const chunkSize = 12; 
    let pdfPaths = []; 

    for (let i = 0; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize);
        const html = generateHTML(chunk); 
        const pdfPath = await generatePDF(html); 
        if (pdfPath) pdfPaths.push(pdfPath); 
    }

    let mergedPDFPath;
    if (pdfPaths.length > 1) {
        const mergedPdfDoc = await PDFDocument.create();

        for (const pdfPath of pdfPaths) {
            const pdfBytes = fs.readFileSync(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => mergedPdfDoc.addPage(page));
        }

        mergedPDFPath = path.join(__dirname, 'scrolls.pdf');
        const mergedPdfBytes = await mergedPdfDoc.save();
        fs.writeFileSync(mergedPDFPath, mergedPdfBytes);
        console.log("📄 PDFs merged successfully!");

        for (const pdfPath of pdfPaths) {
            fs.unlinkSync(pdfPath); 
            console.log(`🗑️ Deleted: ${pdfPath}`);
        }
    } else {
        mergedPDFPath = pdfPaths[0];
    }

    return mergedPDFPath;
};


const sendPDFEmail = async (email) => {
    console.log('📤 Sending email with PDF...');
    const mergedPDFPath = await createProductsPDF();
    const auth = await authorize();
    await sendEmail(auth, email, mergedPDFPath);
};

module.exports = {
    sendPDFEmail
};
