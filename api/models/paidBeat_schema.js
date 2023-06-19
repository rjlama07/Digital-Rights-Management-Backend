const mongoose = require("mongoose");

const paidBeat = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  beatName: String,
  producerName: String,
  beatUrl: String,
  price: String,
});

module.exports = mongoose.model("paidBeat", paidBeat);
