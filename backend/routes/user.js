const express = require('express');

const userController = require('../controllers/user');
const router = express.Router();

router.post('/signup/',userController.createUser);
router.post('/signin/',userController.signinUser);

module.exports = router;