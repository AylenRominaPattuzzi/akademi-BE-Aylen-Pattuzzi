const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;