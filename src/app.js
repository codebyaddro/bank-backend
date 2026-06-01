const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"));

app.get("/", (_, res) => {
    res.send("Hello World");
});

module.exports = app;