const sequelize = require('../database/db');
const Expense = require('../models/expense');
const User = require('../models/user');

async function getAllExpenses(req, res) {
    
    let currentPage = +req.query.currentPage;
    let pageSize = +req.query.rowsPerPage;

    Expense.find({ userId: req.user._id })
        .then((expenses) => {
            let totalPages = Math.ceil(expenses.length / pageSize);
            if (currentPage > totalPages || currentPage < 1) {
                res.status(404).json({ success: false, message: 'page not exist' });
            } else {
                let startIndex = (currentPage - 1) * pageSize;
                let endIndex = startIndex + pageSize;
                let itemsToSend = expenses.slice(startIndex, endIndex);
                itemsToSend = itemsToSend.map(e => {
                    return e.data;
                });

                let data = {
                    'hasNextpage': (currentPage < totalPages) ? true : false,
                    'hasPreviousPage': (currentPage > 1) ? true : false,
                    'currentPage': currentPage,
                    'lastPage': totalPages,
                    'previousPage': currentPage - 1,
                    'expenses': itemsToSend,
                }
                res.status(200).json({ success: true, response: data });
            }
        })
        .catch(err => { 
            console.log('error in getting all expenses', err);
        })

}

async function addExpense(req, res) {

    const { amount, description, category } = req.body;
    let expense = new Expense({
        userId: req.user._id,
        data: {
            amount: +amount,
            description: description,
            category: category,
        }
    });
    expense.save()
        .then((expense)=>{
            req.user.totalExpense = req.user.totalExpense + expense.data.amount
            req.user.save()
                .then(()=>{
                    res.status(200).json({ 'success': true, 'response': {id: expense._id, amount: expense.data.amount, description: expense.data.description, category: expense.data.category} });
                })
                .catch(err=>{
                    res.status(500).json({ 'success': false, 'response': err });
                })
        })
        .catch(err=>{
            console.log('error in creating new expense', err);
            res.status(500).json({ 'success': false, 'response': err });
        })
}

async function deleteExpense(req, res) {
    const expenseId = req.params.id;
    console.log('expense id', expenseId);
    Expense.deleteOne({_id: expenseId})
        .then(async (expense)=>{
            console.log('expense to be deleted', expense);
            res.status(200).json({ success: true, message: "successfully deleted" })
        })
        .catch(err=>{
            console.log('error in deleting expense', err);
            res.status(500).json({ success: false, error: err })     
        })
}

module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
}