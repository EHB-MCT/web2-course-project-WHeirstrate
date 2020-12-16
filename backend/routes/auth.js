const express = require('express');
const router = express.Router();

const authController = require('../backend/controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);