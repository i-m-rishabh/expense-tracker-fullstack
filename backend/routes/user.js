const express = require('express');

const userController = require('../controllers/user');
const router = express.Router();

router.get('/get-all-users', userController.getUsers);
router.post('/signup/',userController.createUser);
router.post('/signin/',userController.signinUser);

module.exports = router;