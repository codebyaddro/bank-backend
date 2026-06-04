const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");

const createAccount = async (req, res) => {
    try {
        const user = req.user;

        const account = await Account.create({ user: user._id });

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createAccount };