const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const albumScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  albumName: String,
  imageUrl: String,
  artist: String,
  songs: [songSchema], //
});
module.exports = mongoose.model("albumScheme", albumScheme);




