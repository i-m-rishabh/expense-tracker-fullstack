const sequelize = require('../database/db');
const Sequelize = require('sequelize');

const Expense = sequelize.define('expense', {
    amount: Sequelize.FLOAT,
    description: Sequelize.STRING,
    category: Sequelize.STRING,
})

module.exports = Expense;