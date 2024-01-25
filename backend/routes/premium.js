
const express = require('express');

const Authenticate = require('../middlewares/auth');
const controllers = require('../controllers/premium');

const Router = express.Router();


Router.get('/purchase_membership', Authenticate.authorization, controllers.purchasePremium);
Router.post('/updatePaymentStatus', Authenticate.authorization, controllers.updatePaymentStatus);

module.exports = Router;