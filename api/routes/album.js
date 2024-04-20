const { uploadAlbum } = require("../controllers/album.controller.js");
const express = require("express");
const router = express.Router();

router.post("/uploadAlbum", uploadAlbum);

module.exports = router;
