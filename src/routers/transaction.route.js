const express = require("express");
const router = express.Router();
const { createTransaction } = require("../controllers/transaction.controller");
const { authMiddleware, authSystemUserMiddleware } = require("../middlewares/auth.middleware");

/**
 * - POST /api/v1/transactions
 * - Create transaction
 */
router.post("/", authMiddleware, createTransaction);

/**
 * - POST /api/v1/transactions/system/initial-funds
 * - Create initial funds
 */
router.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction);

module.exports = router;