

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    data: {
        amount: Number, 
        description: String,
        category: String,
    }
});

module.exports = mongoose.model('Expense', expenseSchema);