const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/getAllUsers', authenticateToken, userController.getAllUsers);
router.get('/getCurrentUser', authenticateToken, userController.getCurrentUser);
router.post('/addUser', userController.addUser);
router.put('/updateUserDetails', authenticateToken, userController.updateUserDetails);
router.post('/loginUser', userController.loginUser);
router.delete('/deleteUser', authenticateToken, userController.deleteUser);

module.exports = router;
