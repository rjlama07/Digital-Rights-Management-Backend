const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Artist = require("../models/artist_schema");

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
              message: "Login successfull",

              role: user[0].role,
              artistFollowing: user[0].artistFollowing,
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
router.post("/updatePassword", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "marasini", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData["id"] })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            bcrypt.compare(
              req.body.oldPassword,
              user[0].password,
              (err, result) => {
                if (!result) {
                  return res.status(401).json({
                    error: "Invalid Password",
                  });
                } else {
                  bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({
                        error: "Internal Server Error",
                      });
                    } else {
                      User.updateOne(
                        { _id: authData["id"] },
                        { $set: { password: hash } }
                      )
                        .exec()
                        .then((result) => {
                          res.status(200).json({
                            message: "Password Updated Successfully",
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
                }
              }
            );
          }
        });
    }
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
        console.log(err);
        res.status(500).json({
          error: "Internl Server Error",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          role: "User",
          imageUrl: "https://i.stack.imgur.com/l60Hf.png",
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
              error: "Internal Server Error",
            });
          });
      }
    });
  }
});

router.get("/getArtistFollowing", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData["id"] })
        .populate("artistFollowing")
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            res.status(200).json({
              message: "Artist Following",
              artistFollowing: user[0].artistFollowing,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.put("/followArtist", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData["id"] })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            User.updateOne(
              { _id: authData["id"] },
              { $push: { artistFollowing: req.body.artistId } }
            )
              .exec()
              .then((result) => {
                res.status(200).json({
                  message: "Artist Followed",
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
    }
  });
});

router.put("/followMultipleArtist", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData["id"] })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            /// req.body.artistId is an array of artistId
            User.updateOne(
              { _id: authData["id"] },
              {
                $push: { artistFollowing: { $each: req.body.artistId } },
              }
            )
              .exec()
              .then((result) => {
                res.status(200).json({
                  message: "Artist Followed",
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
    }
  });
});

router.put("/unfollowArtist", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData.id })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User does not exist",
            });
          } else {
            User.updateOne(
              { _id: authData.id },
              { $pull: { artistFollowing: req.body.artistId } } // Removes the artistId from the artistFollowing array
            )
              .exec()
              .then((result) => {
                res.status(200).json({
                  message: "Artist Unfollowed",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: "Internal Server Error",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Internal Server Error",
          });
        });
    }
  });
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

router.get("/getUserInfo", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.find({ _id: authData["id"] })
        .exec()
        .then((user) => {
          if (user.length < 1) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            res.status(200).json({
              message: "User Data",
              email: user[0].email,
              role: user[0].role,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              imageUrl:
                user[0].imageUrl != null
                  ? user[0].imageUrl
                  : "https://i.stack.imgur.com/l60Hf.png",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
      // res.status(200).json({
      //   authData,
      // });
    }
  });
});

router.get("/getUserLibrary", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      User.findOne({ _id: authData["id"] })
        .exec()
        .then((user) => {
          if (!user) {
            return res.status(401).json({
              error: "User not exist",
            });
          } else {
            // Fetch artist following
            const artistIds = user.artistFollowing; // Assuming artistFollowing is an array of artist IDs

            // Fetch artists based on the IDs
            Artist.find({ _id: { $in: artistIds } })
              .exec()
              .then((artists) => {
                res.status(200).json({
                  message: "User Library",
                  artistFollowing: artists,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

module.exports = router;
