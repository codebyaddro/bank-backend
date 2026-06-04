const mongoose = require("mongoose");
const chalk = require("chalk");

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async (req, res) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.green(`Database connected successfully. \nHost-name: ${conn.connection.host}. \nDB-name: ${conn.connection.name}`));
    } catch (error) {
        console.log(chalk.red(`Database connection failed. Error ${error.message}`));
        process.exit(1);
    }
};

module.exports = connectDB;