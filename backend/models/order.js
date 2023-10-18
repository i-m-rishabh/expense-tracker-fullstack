
const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Order = sequelize.define('order', {
    order_id: Sequelize.STRING,
    status: Sequelize.STRING,
    payment_id: Sequelize.STRING,
});

module.exports = Order;