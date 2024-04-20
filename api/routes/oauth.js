const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing passwords
const crypto = require("crypto"); // Import crypto for generating random passwords
const mongoose = require("mongoose");

const router = express.Router();

router.use(bodyParser.json());

router.post("/signInWithGoogle", (req, res) => {
  const { idToken } = req.body;
  axios
    .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
    .then((response) => {
      const { email, given_name, family_name, picture } = response.data;
      User.find({ email: email })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            bcrypt.hash(generateRandomPassword(12), 10, (err, hash) => {
              if (err) {
                console.log(err);
                res.status(500).json({
                  error: "Internal Server Error",
                });
              } else {
                const newUser = new User({
                  _id: new mongoose.Types.ObjectId(),
                  firstName: given_name,
                  lastName: family_name,
                  email: email,
                  password: hash,
                  role: "User",
                  imageUrl: picture,
                });
                newUser
                  .save()
                  .then((result) => {
                    const token = jwt.sign(
                      {
                        id: result._id,
                        email: result.email,
                        role: result.role,
                        firstName: result.firstName,
                        lastName: result.lastName,
                      },
                      "1234mmm",
                      {
                        expiresIn: "120h",
                      }
                    );
                    res.status(200).json({
                      message: "Login successful",
                      role: result.role,
                      accessToken: token,
                      artistFollowimng: result.artistFollowing,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: "Internal Server Error",
                    });
                  });
              }
            });
          } else {
            console.log("User already exists");
            const token = jwt.sign(
              {
                id: user[0]._id,
                email: user[0].email,
                role: user[0].role,
                firstName: user[0].firstName,
                lastName: user[0].lastName,
              },
              "1234mmm",
              {
                expiresIn: "120h",
              }
            );
            res.status(200).json({
              message: "Login successful",
              role: user[0].role,
              accessToken: token,
            });
          }
        });
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }

  return password;
}
