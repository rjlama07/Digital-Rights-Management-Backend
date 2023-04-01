const express = require("express");
const { model } = require("mongoose");

const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/login", (req, res, next) => {
  User.find()
    .then((result) => {
      res.status(200).json({
        studentData: result,
      });
    })
    .catch((err) => {
      res.status(401).json({
        error: "authentication failed",
      });
    });
});

router.post("/signup", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user != null) {
    res.status(409).json({
      error: "User with this email already exist",
    });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          role: "User",
        });
        user
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User created Sucessfully",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  }
});

module.exports = router;
