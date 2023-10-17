const User = require('../models/user');
const Expense = require('../models/expense');

module.exports = {
    associatedModels: () => {
        User.hasMany(Expense);
        Expense.belongsTo(User);
    }
}

