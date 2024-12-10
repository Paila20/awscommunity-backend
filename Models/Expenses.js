const mongoose = require('mongoose');
const UserModel = require("./User");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    text: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;