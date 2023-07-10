const express = require("express");
const { model } = require("mongoose");
const Favorite = require("../models/favourite");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Beat = require("../models/beat");

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

router.post("/addToFavourites", verifyToken, (req, res) => {
  jwt.verify(req.token, "marasini", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: err,
      });
    } else {
      // Create a new favorite document
      const newFavorite = new Favorite({
        userId: authData["id"],
        productId: req.body.productId,
      });

      // Save the favorite document to the database
      newFavorite
        .save()
        .then(() => {
          res
            .status(200)
            .json({ message: "Favorite product stored successfully." });
        })
        .catch((err) => {
          console.error("Error storing favorite product:", err);
          res.status(500).json({ message: "Error storing favorite product." });
        });
    }
  });
});

router.get("/getFavouriteBeat", verifyToken, (req, res) => {
  jwt.verify(req.token, "marasini", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: err,
      });
    } else {
      const { id: userId } = authData;
      Favorite.find({ userId })
        .then((favorites) => {
          const productIds = favorites.map((favorite) => favorite.productId);

          // Find beats with matching productIds
          Beat.find({ _id: { $in: productIds } })
            .then((beats) => {
              res.status(200).json({ beats });
            })
            .catch((err) => {
              console.error("Error retrieving favorite beats:", err);
              res
                .status(500)
                .json({ message: "Error retrieving favorite beats." });
            });
        })
        .catch((err) => {
          console.error("Error retrieving favorite beats:", err);
          res.status(500).json({ message: "Error retrieving favorite beats." });
        });
    }
  });
});

module.exports = router;
