const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  songName: String,
  songUrl: String,
  imageUrl: String,
  artistId: String,
  genere: String,
});

module.exports = mongoose.model("song", songSchema);
