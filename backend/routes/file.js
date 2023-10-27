const express = require('express');
const controllers = require('../controllers/downloadedFile.js');
const Authenticate = require('../middlewares/auth.js');

const Router = express.Router();

Router.get('/getAllFiles', Authenticate.authorization, controllers.getAllFiles);

module.exports = Router;