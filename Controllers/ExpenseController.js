

const Expense = require("../Models/Expenses");

const addExpense= async (req, res) => {

    const { text, amount } = req.body; 
    const{_id} = req.user;
    console.log(text, amount,_id );
  
    const newExpense = new Expense({
        text,
        amount,
        userId: _id, 
    });

    try {
       
        await newExpense.save();
            res.status(200).json({
            message: 'Expense added successfully',
            success: true,
            expense:newExpense
        });
    } catch (err) {
       
        res.status(500).json({
            message: 'Something went wrong',
            error: err,
            success: false,
        });
    }
};

const getAllExpenses = async (req, res) => {
    const { _id } = req.user;

    try {
        const expenses = await Expense.find({ userId: _id });
        res.status(200).json({
            message: 'Expenses fetched successfully',
            success: true,
            expenses,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong',
            error: err,
            success: false,
        });
    }
};

const deleteExpense = async (req, res) => {
    const { expenseId} = req.params;
    console.log(expenseId)

    try {
        const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        if (!deletedExpense) {
            return res.status(404).json({
                message: 'Expense not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Expense deleted successfully',
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong',
            error: err,
            success: false,
        });
    }
};

const updateExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { text, amount } = req.body;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            { text, amount },
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({
                message: 'Expense not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Expense updated successfully',
            success: true,
            expense: updatedExpense,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong',
            error: err,
            success: false,
        });
    }
};



module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
    updateExpense
}