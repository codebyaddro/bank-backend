const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("../src/routers/auth.route");
const accountRoutes = require("../src/routers/account.route");
const transactionRoutes = require("../src/routers/transaction.route");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.get("/", (_, res) => {
    res.send("Hello World");
});

module.exports = app;