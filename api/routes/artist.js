const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Artist = require("../models/artist_schema");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User=require("../models/user");

router.post("/login", (req, res, next) => {
  console.log("Hello world");
  Artist.find({ email: req.body.email })
    .exec()
    .then((artist) => {
      if (artist.length < 1) {
        return res.status(401).json({
          error: "User not exist",
        });
      } else {
        bcrypt.compare(req.body.password, artist[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              error: "Invalid Password",
            });
          } else {
            const token = jwt.sign(
              {
                id: artist[0]._id,
                email: artist[0].email,
                role: artist[0].role,
                name: artist[0].name,
                activeSince: artist[0].activeSince,
              },
              "1234mmm",
              {
                expiresIn: "120h",
              }
            );
            res.status(200).json({
              message: "Login successfull",
              role: artist[0].role,
              accessToken: token,
            });
          }
        });
      }
    });
});

router.post("/signup", async (req, res, next) => {
  const artist = await Artist.findOne({ email: req.body.email });
  if (artist == null) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const artist = new Artist({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: hash,
          profileUrl: req.body.profileUrl,
          activeSince: new Date(),
        });
        artist
          .save()
          .then((result) => {
            res.status(201).json({
              message: "Artist created",
              result: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  } else {
    res.json({
      message: "Artist already exist",
    });
  }
});


function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
    } else {
      res.status(401).json({
        error: "token is not valid",
      });
    }
  }
  
  

  router.get("/getArtist", (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        jwt.verify(req.token, "1234mmm", (err, authData) => {
            if (err) {
                return res.status(401).json({
                    error: err,
                });
            } else {
                const userId = authData.id;
                User.findById(userId)
                    .exec()
                    .then((user) => {
                        const followingArtistIds = user.artistFollowing.map(artistId => artistId.toString()); // Assuming artistFollowing contains ObjectId(s)
                        Artist.find()
                            .exec()
                            .then((artists) => {
                                const modifiedArtists = artists.map((artist) => {
                                    return {
                                        ...artist._doc,
                                        isFollowing: followingArtistIds.includes(artist._id.toString()),
                                    };
                                });
                                res.status(200).json({
                                    artists: modifiedArtists,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                });
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
    } else {
        // No token provided, fetch all artists without considering user's following list
        Artist.find()
            .exec()
            .then((artists) => {
                res.status(200).json({
                    artists: artists,
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

module.exports = router;
