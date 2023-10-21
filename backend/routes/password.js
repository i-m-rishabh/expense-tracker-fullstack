const express = require('express');
const controller = require('../controllers/password');

const router = express.Router();

router.post('/forget-password', controller.forgetPassword);
router.get('/reset-password/:uuid', controller.resetPassword);
router.post('/reset-password/:uuid', controller.changePassword);

module.exports = router;