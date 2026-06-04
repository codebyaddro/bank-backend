const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("../src/routers/auth.route");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

app.get("/", (_, res) => {
    res.send("Hello World");
});

module.exports = app;