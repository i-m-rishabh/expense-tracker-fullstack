const express = require('express');
const controller = require('../controllers/password');

const router = express.Router();

router.post('/forget-password', controller.forgetPassword);

module.exports = router;