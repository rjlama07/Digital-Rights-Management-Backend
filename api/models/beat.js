const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const beatSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  beatName: String,
  producerName: String,
  beatUrl: String,
});

module.exports = mongoose.model("beat", beatSchema);
