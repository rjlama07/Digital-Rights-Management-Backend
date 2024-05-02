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

router.post("/getSongbyId", (req, res) => {
  const songId = req.body.songId;
  Song.find({ _id: songId }).then((song) => {
    res.json({ song });
  });
});

router.post("/addSong", (req, res) => {
  const song = new Song({
    _id: new mongoose.Types.ObjectId(),
    songName: req.body.songName,
    songUrl: req.body.songUrl,
    imageUrl: req.body.imageUrl,
    artist: req.body.artist,
  });

  song
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Song added Sucesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
});

router.get("/getArtistSong", (req, res) => {
  const artistId = req.query.artist;

  Song.find({ artistId: artistId })
    .then((song) => {
      console.log("hellow world");
      console.log(song);
      res.json({ song });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});
router.get("/searchSong", async (req, res) => {
  jwt_controller.verifyToken(req, res, async () => {
    jwt.verify(req.token, "1234mmm", async (err, authData) => {
      try {
        const search = req.query.search;
        console.log("Search query:", search);

        let songResult, artistResult;

        try {
          songResult = await Song.find({
            songName: { $regex: search, $options: "i" },
          });
        } catch (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
          artistResult = await Artist.find({
            name: { $regex: search, $options: "i" },
          });
        } catch (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        ///push search query to userschema
        const userId = authData.id;
        const userResult = await User.find({ _id: userId });
        if (userResult) {
          userResult[0].searchHistory.push(search);
          userResult[0].save();
        }

        res.json({ song: songResult, artist: artistResult });
      } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
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

router.put("/deleteSong", verifyToken, (req, res) => {
  jwt.verify(req.token, "1234mmm", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: err,
      });
    } else {
      const songId = req.body.songId;
      const artistId = authData.id;

      //only delete if the song belongs to the artist
      Song.findOneAndDelete({ _id: songId, artistId: artistId })
        .then((result) => {
          if (result) {
            res.status(200).json({
              message: "Song deleted successfully",
            });
          } else {
            res.status(404).json({
              message: "Song not found",
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

router.get("/trendingSongs", (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10, you can adjust it as needed

  Song.find()
    .sort({ stream: -1 }) // Sort by stream count in descending order
    .limit(limit) // Limit the number of results
    .exec()
    .then((songs) => {
      res.status(200).json({
        message: "Trending songs retrieved successfully",
        songs: songs,
      });
    })
    .catch((err) => {
      console.log("Error retrieving trending songs:", err);
      res.status(500).json({
        error: "Failed to retrieve trending songs",
      });
    });
});

router.put("/addSongCount", (req, res) => {
  console.log("addSongCountdnasdjnajsdnbjansjndaksjdn");
  const songId = req.body.songId;

  Song.findById(songId)
    .exec()
    .then((song) => {
      if (song) {
        // Check if the current stream count is a valid number
        if (!isNaN(song.stream)) {
          // Increment the stream count
          song.stream += 1;
        } else {
          // If stream count is NaN, set it to 1
          song.stream = 1;
        }

        song
          .save()
          .then((result) => {
            console.log("doneeeee");
            res.status(200).json({
              message: "Stream count added successfully",
            });
          })
          .catch((err) => {
            console.log("Error saving the song:");
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else {
        console.log("Song not found");
        res.status(404).json({
          message: "Song not found",
        });
      }
    })
    .catch((err) => {
      console.log("Error finding the song:");
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/trendingSongs", (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10, you can adjust it as needed

  Song.find()
    .sort({ stream: -1 }) // Sort by stream count in descending order
    .limit(limit) // Limit the number of results
    .exec()
    .then((songs) => {
      res.status(200).json({
        message: "Trending songs retrieved successfully",
        songs: songs,
      });
    })
    .catch((err) => {
      console.log("Error retrieving trending songs:", err);
      res.status(500).json({
        error: "Failed to retrieve trending songs",
      });
    });
});

router.put("/addLikedSong", (req, res) => {
  jwt_controller.verifyToken(req, res, async () => {
    jwt.verify(req.token, "1234mmm", async (err, authData) => {
      console.log(req.body);
      const songId = req.body.songId;
      console.log("Song ID:", songId);

      const userId = authData.id;
      const userResult = await User.find({ _id: userId });
      if (userResult) {
        userResult[0].likledSong.push(songId);
        userResult[0].save();
      }
      res.json({ message: "Song added to liked songs" });
    });
  });
});
module.exports = router;
