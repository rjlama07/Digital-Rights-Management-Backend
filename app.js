const express = require("express");

const app = express();
const userRoute = require("./api/routes/user");
const vehicalRoute = require("./api/routes/vehical");

app.use("/user", userRoute);
app.use("/vehical", vehicalRoute);
app.use((req, res, next) => {
  res.status(404).json({
    error: "404 page not found",
  });
});

app.use((req, res, next) => {
  res.status(200).json({
    message: "App is running",
  });
});

module.exports = app;
