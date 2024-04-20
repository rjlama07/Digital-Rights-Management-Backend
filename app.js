const express = require("express");
const mongose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
const userRoute = require("./api/routes/user");
const vehicalRoute = require("./api/routes/vehical");
const uplaodRoute = require("./api/routes/upload");
const producerRoute = require("./api/routes/producer");
const favouriteRoute = require("./api/routes/favourite");
const artistRoute = require("./api/routes/artist");
const songRoute = require("./api/routes/song");
const albumRoute = require("./api/routes/album");
const oAuthRoute = require("./api/routes/oauth");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:qwerty12345@cluster0.mrfhznh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// );

mongose.connect("mongodb://localhost:27017/beatMandu");

localhost: 27017;

mongose.connection.on("error", (err) => {
  console.log("Connection failed");
});
app.use(cors()); //

app.use("/beats", express.static("./tmp/upload/freebeats"));

mongose.connection.on("connected", (connected) => {
  console.log("Connection established");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/vehical", vehicalRoute);
app.use("/upload", uplaodRoute);
app.use("/producer", producerRoute);
app.use("/favourite", favouriteRoute);
app.use("/artist", artistRoute);
app.use("/beats", express.static("./upload/freebeats"));
app.use("/song", songRoute);
app.use("/album", albumRoute);
app.use("/oauth", oAuthRoute);

app.use(cors()); //
module.exports = app;
