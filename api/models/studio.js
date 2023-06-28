const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const studioSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  location: String,
  price: String,
  imageUrl: String,
  rating: String,
});

module.exports = mongoose.model("studio", studioSchema);
