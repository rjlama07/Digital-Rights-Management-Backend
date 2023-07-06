const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Producer = require("../models/producer");

const router = express.Router();

router.post("/addProducer", (req, res) => {
  const producer = new Producer({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    rating: req.body.rating,
    profileUrl: req.body.profileUrl,
    activeSince: req.body.activeSince,
    averageDeliveryTime: req.body.averageDeliveryTime,
    genre: req.body.genre,
    package: req.body.package,
  });
  producer
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Producer added Sucesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
});

router.get("/getProducers", (req, res) => {
  Producer.find()
    .then((producer) => {
      res.json({ producer });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.post("/deleteProducers", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Missing 'id' parameter in the request body" });
  }

  Producer.findOneAndDelete({ _id: req.body.id })
    .then((producer) => {
      if (producer) {
        return res.json({ message: "Producer deleted successfully" });
      } else {
        return res.status(404).json({ error: "Producer not found" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});
module.exports = router;
