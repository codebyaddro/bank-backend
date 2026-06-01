const app = require("./src/app");
const http = require("http");

const server = http.createServer(app);

server.listen(5000, () => {
    console.log(`Server is up on port: ${5000}`);
})