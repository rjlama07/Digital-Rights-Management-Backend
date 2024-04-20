const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  albumName: String,
  imageUrl: String,
  artist: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // List of song references
});

module.exports = mongoose.model("Album", albumSchema);
