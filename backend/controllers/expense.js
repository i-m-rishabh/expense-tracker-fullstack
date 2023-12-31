const sequelize = require('../database/db');
const Expense = require('../models/expense');
const User = require('../models/user');

async function getAllExpenses(req, res) {
    // const userId = req.user.id;
    // console.log(userId);
    // const userId = req.params.userId;

    // Expense.findAll({ where: { "userId": userId } })
    //     .then(expenses => {
    //         res.json(expenses);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.json({ "error in getting all expenses": err });
    //     })
    try {
        let currentPage = +req.query.currentPage;
        let pageSize = +req.query.rowsPerPage;

        const userId = req.user.id;
        console.log(userId);

        const expenses = await Expense.findAll({ where: { "userId": userId } })
        // res.status(200).json(expenses);

        // here we have to implement pagination
        let totalPages = Math.ceil(expenses.length / pageSize);
        if (currentPage > totalPages || currentPage < 1) {
            res.status(404).json({ success: false, message: 'page not exist' });
        } else {
            let startIndex = (currentPage - 1) * pageSize;
            let endIndex = startIndex + pageSize;
            let itemsToSend = expenses.slice(startIndex, endIndex);

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



    } catch (err) {
        console.log(err);
        res.status(500).json({ "error in getting all expenses": err });
    }

}

async function addExpense(req, res) {
    // const { amount, description, category } = req.body;
    // const userId = req.user.id;
    // console.log([amount, description, category]);

    // User.findByPk(userId)
    // .then(user => {
    //     user.createExpense({
    //         amount,
    //         description,
    //         category
    //     })
    //         .then(expense => {
    //             user.update({ totalExpense: user.totalExpense + (+amount) })
    //                 .then(() => {
    //                     res.status(200).json({ 'success': true, 'response': expense });
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                 })
    //         })
    //         .catch(err => {
    //             res.status(500).json({ 'success': false, 'response': err });
    //         })
    // })
    const t = await sequelize.transaction();
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId, { transaction: t })
        const expense = await user.createExpense({
            amount,
            description,
            category
        }, { transaction: t })
        await user.update({ totalExpense: user.totalExpense + (+amount) }, { transaction: t })

        await t.commit();
        res.status(200).json({ 'success': true, 'response': expense });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ 'success': false, 'response': err });

    }
}

async function deleteExpense(req, res) {
    // const userId = req.user.id;
    // // const userId = +req.params.userId;
    // const id = +req.params.id;

    // User.findByPk(userId)
    //     .then(user => {
    //         // console.log(user);
    //         user.getExpenses({ where: { 'id': id } })
    //             .then(expenses => {
    //                 // console.log(expenses);
    //                 if (expenses.length === 0) {
    //                     res.status(400).json({ 'success': false, "response": 'expense not found' });
    //                 } else {
    //                     user.update({ totalExpense: user.totalExpense - (expenses[0].amount) })
    //                         .then(() => {
    //                             user.removeExpense(expenses[0])
    //                                 .then(() => {
    //                                     res.status(200).json({ "success": true, "response": "successfully deleted" })
    //                                 })
    //                                 .catch(err => {
    //                                     // console.log(err);
    //                                     res.status(500).json({ "success": false, "response": "error in removig expense", error: err });
    //                                 })
    //                         })

    //                 }
    //             })
    //             .catch(err => {
    //                 res.status(500).json({ success: false, response: "error in getting expenses", error: err })
    //             })
    //     })
    //     .catch(err => {
    //         // console.log(err);
    //         res.status(500).json({ success: false, response: "error in finding user", error: err })
    //     })

    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;
        // const userId = +req.params.userId;
        const id = +req.params.id;

        const user = await User.findByPk(userId)
        // console.log(user);
        const expenses = await user.getExpenses({ where: { 'id': id } })
        // console.log(expenses);
        if (expenses.length === 0) {
            res.status(400).json({ success: false, message: 'expense not found' });
        } else {
            await user.update({ totalExpense: user.totalExpense - (expenses[0].amount) }, { transaction: t })
            await user.removeExpense(expenses[0], { transaction: t });
            res.status(200).json({ success: true, message: "successfully deleted" })

            await t.commit();
        }
    } catch (err) {
        console.err(err);
        await t.rollback();
        res.status(500).json({ success: false, error: err })
    }
}


module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
}