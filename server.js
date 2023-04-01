// const mongose = require("mongoose");
// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
// const app = express();

// const uri =
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority";

// async function connect() {
//   try {
//     await mongose.connect(uri);
//     console.log("database connected");
//   } catch (error) {
//     console.log(error);
//   }
// }

// connect();
// app.listen(8000, () => {
//   console.log("Server startred on port 8000");
// });

const http = require("http");
const app = require("./app");
const server = http.createServer(app);

server.listen(3000, console.log("app is running in local host 30000"));
