const sequelize = require('../database/db');
const Sequelize = require('sequelize');

const Expense = require('./expense');
const Order = require('./order');
const File = require('./downloadedExpenseFiles');
const forgetPasswordRequest = require('./forgetPasswordRequests');

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
    },
    isPremiumUser:{
        type:Sequelize.BOOLEAN,
        allowNull: true,
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        allowNull: true,
    },
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgetPasswordRequest);
forgetPasswordRequest.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

module.exports = User;