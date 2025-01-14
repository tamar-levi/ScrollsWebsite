const User = require('../models/userModel'); 
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcryptjs');


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) {
        console.error('Error fetching users', err);
        res.status(500).send('Database error');
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching current user', err);
        res.status(500).send('Database error');
    }
};

const addUser = async (req, res) => {
    const { fullName, displayName, phoneNumber, email, city, isSeller, password } = req.body;

    try {
        const newUser = new User({
            fullName, displayName, phoneNumber, email, city, isSeller, password
        });

        await newUser.save();
        const payload = { id: newUser._id, email: newUser.email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.json({
            message: 'User created successfully',
            token: token,
        });
    } catch (err) {
        console.error('Error creating user', err);
        res.status(500).send('Database error');
    }
};


const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; 
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user', err);
        res.status(500).send('Database error');
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ displayName: username }); 
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token: token,
        });
    } catch (err) {
        console.error('Error logging in', err);
        res.status(500).send('Server error');
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).send('Server error');
    }
};

module.exports = { getAllUsers, getCurrentUser, addUser, updateUserDetails, loginUser, deleteUser };
