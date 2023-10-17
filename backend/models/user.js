const sequelize = require('../database/db');
const Sequelize = require('sequelize');

const Expense = require('./expense');

const User = sequelize.define('user',{
    username:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
    }
});

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = User;