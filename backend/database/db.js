
const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker','root','rishabh',{
    host:'localhost',
    dialect:'mysql'
});


module.exports = sequelize;