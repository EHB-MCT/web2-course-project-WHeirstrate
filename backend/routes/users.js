const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.get('/', userController.readAll);
router.post('/user', userController.readOne);
router.post('/update', authenticate, userController.update);

module.exports = router;