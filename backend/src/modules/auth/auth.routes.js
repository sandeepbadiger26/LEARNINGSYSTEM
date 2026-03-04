const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validator');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
