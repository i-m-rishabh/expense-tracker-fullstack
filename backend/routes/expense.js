const express = require('express');

const expenseController = require('../controllers/expense');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/add-expense', auth.authorization,  expenseController.addExpense);
router.get('/get-all-expense',auth.authorization,  expenseController.getAllExpenses);
router.delete('/:id/',auth.authorization, expenseController.deleteExpense);


module.exports = router;