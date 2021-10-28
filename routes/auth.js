const express = require('express')
const router = express.Router();
// importing the controller
const validator = require("../middleware/xssMiddleware")
const authController = require('../controllers/auth')

router.post('/login', validator.login, authController.login);
router.get('/logout', authController.logout);
router.post('/register', validator.register, authController.register);

module.exports = router