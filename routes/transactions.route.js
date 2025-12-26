import express from "express";
import {sql} from "../config/db.js";
import {getTransactionByUserId, createTransactions, deleteTransactionByUserId, getTransactionSummaryByUserId} from "../controller/transactions.controller.js";

const router  = express.Router();

router.post("/", createTransactions);

router.get("/:userId", getTransactionByUserId);

router.delete("/:userId", deleteTransactionByUserId)


router.get("/summary/:userId", getTransactionSummaryByUserId);



export default router;