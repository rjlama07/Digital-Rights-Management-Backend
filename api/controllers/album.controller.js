const Album = require("../models/album");

const uploadAlbum = async (req, res) => {
  const album = new Album({
    _id: new mongoose.Types.ObjectId(),
    albumName: req.body.albumName,
    imageUrl: req.body.imageUrl,
    artist: req.body.artist,
    songs: req.body.songs,
  });
  album
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Album created",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = { uploadAlbum };
