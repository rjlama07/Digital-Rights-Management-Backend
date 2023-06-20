const express = require("express");
const mongose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
const userRoute = require("./api/routes/user");
const vehicalRoute = require("./api/routes/vehical");
const uplaodRoute = require("./api/routes/upload");
mongose.connect(
  "mongodb+srv://riteshlama5:s123456@rentgaram.fmh4lvu.mongodb.net/?retryWrites=true&w=majority"
);

mongose.connection.on("error", (err) => {
  console.log("Connection failed");
});
app.use(cors()); //

app.use("/beats", express.static("./upload/freebeats"));

mongose.connection.on("connected", (connected) => {
  console.log("Connection established");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/vehical", vehicalRoute);
app.use("/upload", uplaodRoute);
app.use("/beats", express.static("./upload/freebeats"));

app.use(
  cors({
    origin: "https://real-erin-bighorn-sheep-sari.cyclic.app",
  })
);

module.exports = app;
