const mongoose = require("mongoose");

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  profileUrl: String,
  activeSince: String,
});
module.exports = mongoose.model("artist_schema", artistSchema);
