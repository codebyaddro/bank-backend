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

const getUserAccounts = async (req, res) => {
    try {
        const user = req.user;

        const account = await Account.find({ user: user._id });

        res.status(200).json({
            success: true,
            message: "Account fetched successfully.",
            data: account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAccountBalance = async (req, res) => {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

module.exports = { createAccount, getAllAccounts, getAccountBalance };