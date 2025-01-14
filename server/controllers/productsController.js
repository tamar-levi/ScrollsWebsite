const Product = require('../models/productModel'); 
require('dotenv').config();

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (err) {
        console.error('Error fetching products', err);
        res.status(500).send('Database error');
    }
};

const addProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { scriptType, scrollType, price, primaryImage, additionalImages, note, isPremiumAd } = req.body;
        const newProduct = new Product({
            scriptType,
            scrollType,
            price,
            primaryImage,
            additionalImages,
            note,
            isPremiumAd,
            userId, 
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product', err);
        res.status(500).send('Database error');
    }
};

const getAllProductsByUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const products = await Product.find({ userId });
        res.json(products);
    } catch (err) {
        console.error('Error fetching products', err);
        res.status(500).send('Database error');
    }
};

const updateProductsDetails = async (req, res) => {
    try {
        const userId = req.user.id; 
        const productId = req.params.id; 
        const updates = req.body; 

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error('Error updating product', err);
        res.status(500).send('Database error');
    }
};


module.exports = { getAllProducts, addProduct, updateProductsDetails, getAllProductsByUser};