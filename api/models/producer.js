const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const producerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  rating: String,
  profileUrl: String,
  activeSince: String,
  aveageDelivaryTime: String,
  genre: String,
  package: {
    basic: {
      version: String,
      revision: String,
      price: String,
    },
    standard: {
      version: String,
      revision: String,
      price: String,
    },
    premium: {
      version: String,
      revision: String,
      price: String,
    },
  },
});

module.exports = mongoose.model("producer", producerSchema);
