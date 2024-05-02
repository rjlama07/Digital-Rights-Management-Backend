const mongoose = require("mongoose");

const userSearchHistorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  search: [String],
  searchTime: [Date],
});

module.exports = mongoose.model("userSearch", userSearchHistorySchema);
