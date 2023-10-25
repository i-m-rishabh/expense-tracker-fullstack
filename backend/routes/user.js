const express = require('express');
const auth = require('../middlewares/auth');

const userController = require('../controllers/user');
const router = express.Router();

router.get('/get-all-users', userController.getUsers);
router.post('/signup/',userController.createUser);
router.post('/signin/',userController.signinUser);
router.get('/download/', auth.authorization, userController.downloadReport);

module.exports = router;