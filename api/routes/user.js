const express = require("express");
const { model } = require("mongoose");

const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          error: "User not exist",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              error: "Invalid Password",
            });
          } else {
            const token = jwt.sign(
              {
                email: user[0].email,
                role: user[0].role,
                firstName: user[0].firstName,
                lastName: user[0].lastName,
              },
              "this is dummy text",
              {
                expiresIn: "24h",
              }
            );
            res.status(200).json({
              message: "Login successfull",
              email: user[0].email,
              role: user[0].role,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              accessToken: token,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
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
