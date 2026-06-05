const express = require("express");
const router = express.Router();
const { createAccount, getUserAccounts, getAccountBalance } = require("../controllers/account.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createAccount);

router.get("/", authMiddleware, getUserAccounts);

router.get("/balance/:accountId", authMiddleware, getAccountBalance);

module.exports = router;