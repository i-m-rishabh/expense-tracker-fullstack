const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const File = sequelize.define('File',{
    name: Sequelize.STRING,
    Url: Sequelize.STRING,
    date: Sequelize.DATE,
});

module.exports = File;
