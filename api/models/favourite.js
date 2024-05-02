const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: String,
  productId: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
