const express = require("express");
const router = express.Router();
const { createAccount } = require("../controllers/account.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createAccount);

module.exports = router;