const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Song = require("../models/song");
const User = require("../models/user");
const router = express.Router();
const Artist = require("../models/artist_schema");

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
  try {
    const search = req.query.search;
    console.log(search);

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

    res.json({ song: songResult, artist: artistResult });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
