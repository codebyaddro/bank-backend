const express = require("express");
const router = express.Router();
const { createTransaction } = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createTransaction);

module.exports = router;