const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Song = require("../models/song");

const router = express.Router();
const Artist = require("../models/artist_schema");
const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const jwt_controller = require("../controllers/jwt.controller");
const User = require("../models/user");

const { PythonShell } = require("python-shell");

// Example DataFrame (replace with your actual data)
const df = [
  {
    _id: 1,
    likledSong: ["song1", "song2"],
    artistFollowing: ["artist1", "artist2"],
    searchHistory: ["album1", "album2"],
  },
  {
    _id: 2,
    likledSong: ["song3", "song4"],
    artistFollowing: ["artist3", "artist4"],
    searchHistory: ["album3", "album4"],
  },
  //
];
// Endpoint to get recommendations for a user
router.get("/recommendations", (req, res) => {
  console.log("recommendation");
  const userId = req.query.userId;

  // Options for PythonShell
  const options = {
    mode: "json",
    pythonOptions: ["-u"], // get print results in real-time
    args: JSON.stringify(df),
  };

  // Call Python functions
  PythonShell.run("./api/py/recommendations.py", options, (err, results) => {
    console.log("results", results);
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      // Extract recommendations for the user
      console.log(results);
      const userRecommendations = results.generate_recommendations(userId);
      res.json(userRecommendations);
    }
  });
});

module.exports = router;
