const Product = require('../models/productModel');
require('dotenv').config();
const mongoose = require('mongoose');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}, '-primaryImage -additionalImages')
        .populate('userId')
        .lean();        
        res.json(products);
    } catch (err) {
        console.error('Error fetching products', err);
        res.status(500).json({ error: 'Database error' }); 
    }
};

const getProductAdditionalImages = async (req, res) => {
    try {
        const productId = req.params.id; 
        const product = await Product.findById(productId, 'additionalImages').lean();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ additionalImages: product.additionalImages || [] });
    } catch (err) {
        console.error('Error fetching additional images', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const getProductPrimaryImage = async (req, res) => {
    try {
        const productId = req.params.id; 
        const product = await Product.findById(productId, 'primaryImage').lean();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ primaryImage: product.primaryImage });
    } catch (err) {
        console.error('Error fetching primary image', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const addProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { scriptType, scrollType, price, note, isPremiumAd } = req.body;

        if (!req.files || !req.files.primaryImage) {
            return res.status(400).json({ message: 'Primary image is required' });
        }

        const primaryImage = req.files.primaryImage[0];
        const additionalImages = req.files.additionalImages || [];

        const newProduct = new Product({
            scriptType,
            scrollType,
            price,
            primaryImage: primaryImage.buffer.toString('base64'),
            additionalImages: additionalImages.map(img => img.buffer.toString('base64')),
            note,
            isPremiumAd,
            userId,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct, productId: newProduct._id });
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
    const { id } = req.params;
    const updates = req.body;
    if (req.files) {
        if (req.files.primaryImage) {
            updates.primaryImage = req.files.primaryImage[0].buffer;
        }
        if (req.files.additionalImages) {
            updates.additionalImages = req.files.additionalImages.map(image => image.buffer);
        }
    }
    console.log('Update request received');
    try {
        if (!id) {
            console.error('ID is missing');
            return res.status(400).send('ID is required');
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid ID format:', id);
            return res.status(400).send('Invalid ID format');
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProduct) {
            console.error('Product not found for ID:', id);
            return res.status(404).send('Product not found');
        }

        console.log('Product updated successfully:');

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (err) {
        console.error('Error updating product:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).send('Server error');
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (err) {
        console.error('Error deleting product', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addProductFromForm = async (req, res) => {
    const { scriptType, scrollType, price, note, isPremiumAd, primaryImage, additionalImages, sellerName, phoneNumber, email } = req.body;

    try {

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            const userResponse = await new Promise((resolve) => {
                addUserFromForm({ body: { sellerName, phoneNumber, email } }, {
                    status: () => ({ json: resolve }),
                    json: resolve
                });
            });

            if (!userResponse || !userResponse.userId) {
                return res.status(500).json({ message: 'Failed to create user' });
            }
            user = { _id: userResponse.userId };
        }

        const newProduct = new Product({
            scriptType,
            scrollType,
            price,
            primaryImage,
            additionalImages: additionalImages || [],
            note,
            isPremiumAd,
            userId: user._id
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product from form', err);
        res.status(500).send('Database error');
    }
};

module.exports = { getAllProducts, addProduct, updateProductsDetails, getAllProductsByUser, deleteProduct, addProductFromForm, getProductAdditionalImages, getProductPrimaryImage };