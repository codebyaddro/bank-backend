const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const Ledger = require("../models/ledger.model");
const { sendTransactionEmail } = require("../services/email.service");
const mongoose = require("mongoose")

const createTransaction = async (req, res) => {
    try {
        // Validate request
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "FromAccount, toAccount, amount and idempotencyKey are required"
            })
        }

        const fromUserAccount = await Account.findOne({
            _id: fromAccount,
        })

        const toUserAccount = await Account.findOne({
            _id: toAccount,
        })

        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({
                message: "Invalid fromAccount or toAccount"
            })
        }

        // Validate idempotency key is unique
        const isTransactionAlreadyExists = await Transaction.findOne({
            idempotencyKey: idempotencyKey
        })

        if (isTransactionAlreadyExists) {
            if (isTransactionAlreadyExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already processed",
                    transaction: isTransactionAlreadyExists
                })

            }

            if (isTransactionAlreadyExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction is still processing",
                })
            }

            if (isTransactionAlreadyExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction processing failed, please retry"
                })
            }

            if (isTransactionAlreadyExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction was reversed, please retry"
                })
            }
        }

        // Check account status
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
            })

            // Derive sender balance from ledger
            const balance = await fromUserAccount.getBalance()

            if (balance < amount) {
                return res.status(400).json({
                    message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
                })
            }
        }

        let transaction;

        try {
            // Start transaction
            const session = await mongoose.startSession()
            session.startTransaction()

            transaction = (await Transaction.create([ {
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            } ], { session }))[ 0 ]

            const debitLedgerEntry = await Ledger.create([ {
                account: fromAccount,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT"
            } ], { session })

            await (() => {
                return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
            })()

            const creditLedgerEntry = await Ledger.create([ {
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT"
            } ], { session })

            await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: "COMPLETED" },
                { session }
            )


            await session.commitTransaction()
            session.endSession()
        } catch (error) {

            return res.status(400).json({
                message: "Transaction is Pending due to some issue, please retry after sometime",
            })

        }

        await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: transaction
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createTransaction };