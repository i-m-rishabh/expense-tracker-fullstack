const sequelize = require('../database/db');
const Sequelize = require('sequelize');

const forgetPasswordRequest = sequelize.define('forgetPasswordRequest', {
    id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
    }, 
    userId: Sequelize.INTEGER,
    isActive: Sequelize.BOOLEAN,
});

module.exports = forgetPasswordRequest;