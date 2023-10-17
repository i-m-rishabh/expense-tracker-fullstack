const Expense = require('../models/expense');
const User = require('../models/user');

async function getAllExpenses(req, res) {
    const userId = req.user.id;
    console.log(userId);
    // const userId = req.params.userId;
    
    Expense.findAll({where:{"userId":userId}})
    .then(expenses=>{
        res.json(expenses);
    })
    .catch(err=>{
        console.log(err);
        res.json({"error in getting all expenses":err});
    })

    // User.findByPk(userId)
    // .then(user => {
    //     user.getExpenses()
    //     .then(expenses => {
    //         res.status(200).json({ "success": true, "response": expenses });
    //     })
    //     .catch(err => {
    //         res.status(500).json({"success":false, "response":err});
    //     })
    // })
    // .catch(err => {
    //     res.status(400).json({"success":false, "response":err});        
    // })



    // .then(expenses => {
    //     res.status(200).json({ "success": true, "response": expenses });
    // })
    // .catch(err => {
    //     res.status(500).json({ '"success': false, "response": false });
    // })
    // Expense.findAll()
    //     .then(expenses => {
    //         res.status(200).json({ "success": true, "response": expenses });
    //     })
    //     .catch(err => {
    //         res.status(500).json({ '"success': false, "response": false });
    //     })
}

async function addExpense(req, res) {
    const {amount, description, category } = req.body;
    const userId = req.user.id;
    // console.log([amount, description, category]);

    User.findByPk(userId)
    .then(user => {
        user.createExpense({
            amount,
            description,
            category
        })
        .then(expense =>{
            res.status(200).json({ 'success': true, 'response': expense });
        })
        .catch(err => {
            res.status(500).json({ 'success': false, 'response': err });
        })
    })

    // Expense.create({
    //     amount,
    //     description,
    //     category
    // })
    //     .then(data => {
    //         res.status(200).json({ 'success': true, 'response': data });
    //     })
    //     .catch(err => {
    //         res.status(500).json({ 'success': false, 'response': err });
    //     })
}

async function deleteExpense(req, res) {
    const userId = req.user.id;
    // const userId = +req.params.userId;
    const id = +req.params.id;

    User.findByPk(userId)
        .then(user => {
            // console.log(user);
            user.getExpenses({where: {'id': id}})
            .then(expenses =>{
                // console.log(expenses);
                if(expenses.length === 0){
                    res.status(400).json({'success':false, "response":'expense not found'});
                }else{
                    user.removeExpense(expenses[0])
                    .then(() => {
                        res.status(200).json({"success":true, "response": "successfully deleted"})
                    })
                    .catch(err => {
                        // console.log(err);
                        res.status(500).json({"success":false, "response":"error in removig expense", error: err});
                    })
                }
            })
            .catch(err => {
                res.status(500).json({success:false, response:"error in getting expenses", error:err})
            })
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ success: false, response: "error in finding user", error: err })
        })
}


module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
}