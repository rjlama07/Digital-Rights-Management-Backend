const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  songName: String,
  songUrl: String,
  imageUrl: String,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artist", // This refers to the 'artist' model
  },
});


module.exports = mongoose.model("song", songSchema);