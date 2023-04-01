const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("user", userSchema);
