const express = require("express");
const { model } = require("mongoose");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.status(200).json({
    msg: "this is Signup",
  });
});

router.post("/login", (req, res, next) => {
  res.status(200).json({
    msg: "this is Login",
  });
});

module.exports = router;
