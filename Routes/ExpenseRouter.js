const express = require('express');
const { getAllExpenses, addExpense, deleteExpense,updateExpense }
    = require('../Controllers/ExpenseController');
const router = express.Router();

router.get('/get', getAllExpenses);
router.post('/add', addExpense);
router.delete('/:expenseId', deleteExpense);

router.put('/:expenseId', updateExpense);

module.exports = router;