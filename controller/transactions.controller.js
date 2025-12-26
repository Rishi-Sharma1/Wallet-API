import {sql} from "../config/db.js";


async function getTransactionByUserId(req,res) {
  try {
    const { userId } = req.params;
    const transacions = await sql`
                SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;

    res.status(200).json(transacions);
  } catch (error) {
    console.log("Error getting the transactions");
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createTransactions(req,res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === 0 || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *
            `;
    console.log(transaction);
    res.status(200).json(transaction[0]);
    } catch (error) {
    console.log("Error creating the transaction");
    res.status(500).json({ message: "Internal server error" });
    } 
}

async function deleteTransactionByUserId(req,res) {
  try {
    const { userId } = req.params;

    const result =
      await sql`DELETE FROM transactions WHERE user_id=${userId} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction");
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getTransactionSummaryByUserId(req,res) {
  try {
    const { userId } = req.params;

    const balance = await sql`
                SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id=${userId}`;

    const income = await sql`
                SELECT COALESCE(SUM(amount),0) AS income FROM transactions WHERE user_id=${userId} AND amount > 0`;

    const expense = await sql`
                SELECT COALESCE(SUM(amount),0) AS expense FROM transactions WHERE user_id=${userId} AND amount < 0`;

    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expense: expense[0].expense,
    });
  } catch (error) {
    console.log("Error getting the summary");
    res.status(500).json({ message: "Internal server error" });
  }
}
export {getTransactionByUserId, createTransactions, deleteTransactionByUserId, getTransactionSummaryByUserId};