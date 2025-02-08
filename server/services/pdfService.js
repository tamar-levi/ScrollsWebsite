const fs = require("fs");
const axios = require("axios");
const Handlebars = require("handlebars");
const Product = require("../models/productModel");
const User = require('../models/userModel');
const mongoose = require('mongoose')
require('dotenv').config();

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

const getAllProducts = async () => {
    try {
        const products = await Product.find().populate('userId', 'fullName email phoneNumber city');
        return products.map(product => ({
            scriptType: product.scriptType,
            price: product.price,
            scrollType: product.scrollType,
            note: product.note,
            primaryImage: `data:image/jpeg;base64,${product.primaryImage}`,
            user: {
                fullName: product.userId.fullName,
                email: product.userId.email,
                phoneNumber: product.userId.phoneNumber != '0' ? product.userId.phoneNumber : 'לא צוין',
                city: product.userId.city
            }
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
    try {
        const response = await axios.post("https://api.pdfshift.io/v3/convert/pdf", {
            source: html,
        }, {
            username: 'api', password: "sk_450e7b3880c32cd1ab6adaebc635aa66ead0ad9e",
            responseType: "arraybuffer",
        });
        fs.writeFileSync("products.pdf", response.data);
        console.log("📄 PDF נוצר בהצלחה!");
    } catch (err) {
        console.error("❌ שגיאה ביצירת PDF", err);
    }
};

const createProductsPDF = async () => {
    await connectDB();
    const products = await getAllProducts();
    const html = generateHTML(products);
    await generatePDF(html);
    mongoose.connection.close();
};

createProductsPDF();
