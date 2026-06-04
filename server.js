require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/configs/db.config");
const http = require("http");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
connectDB();

server.listen(PORT, () => {
    console.log(`Server is up on port: ${PORT}`);
});