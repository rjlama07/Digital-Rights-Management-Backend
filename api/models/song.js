const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  songName: String,
  songUrl: String,
  imageUrl: String,
  artistId: String,
  genere: String,
  stream: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        // Check if the value is a valid number
        return !isNaN(v);
      },
      message: (props) => `${props.value} is not a valid number for stream`,
    },
  },
});

module.exports = mongoose.model("song", songSchema);
