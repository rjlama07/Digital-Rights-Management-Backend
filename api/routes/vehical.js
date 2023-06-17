const express = require("express");
const { model } = require("mongoose");

const router = express.Router();

router.get("/vehical", (req, res, next) => {
  res.status(200).json({
    msg: "this is product get request",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    msg: "this is product post request",
  });
});

module.exports = router;
