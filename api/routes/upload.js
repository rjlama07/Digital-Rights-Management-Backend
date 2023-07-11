const express = require("express");
const router = express.Router();
const app = express();
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Beat = require("../models/beat");
const multer = require("multer");
const PaidBeat = require("../models/paidBeat_schema");
const Studio = require("../models/studio");
const Favorite = require("../models/favourite");

const path = require("path");
const User = require("../models/user");
const paidBeat_schema = require("../models/paidBeat_schema");
const cloudinary = require("cloudinary").v2;
app.use("/beats", express.static("./upload/freebeats"));
const jwt = require("jsonwebtoken");
const user = require("../models/user");
cloudinary.config({
  cloud_name: "dyabowhkn",
  api_key: "119218244742822",
  api_secret: "eqzjre-21ikeaEYO4EDlRp3kzzI",
});

const storage = multer.diskStorage({
  destination: "./upload/freebeats",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).json({
      error: "token is not valid",
    });
  }
}

router.post("/postPaidBeat", (req, res) => {
  const beat = new paidBeat_schema({
    _id: new mongoose.Types.ObjectId(),
    beatName: req.body.beatName,
    producerName: req.body.producerName,
    beatUrl: req.body.beatUrl,
    price: req.body.price,
    sampleUrl: req.body.sampleUrl,
  });
  beat
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Beat Uploaded Sucesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
});

router.get("/getPaidBeats", (req, res) => {
  PaidBeat.find()
    .then((paidBeat) => {
      res.json({ paidBeat });
    })
    .catch((error) => {});
});

router.get("/getBeats", (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader != undefined) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
  }
  jwt.verify(req.token, "marasini", async (err, authData) => {
    if (err) {
      const beats = Beat.find().then((beats) => {
        res.json({ beats: beats });
      });
    } else {
      try {
        const userId = authData["id"]; // Assuming the user ID is passed in the request body

        const beats = await Beat.find();

        const beatsWithFavStatus = await Promise.all(
          beats.map(async (beat) => {
            const isFav = await Favorite.exists({
              userId,
              productId: beat.id,
            });
            return { ...beat._doc, isFav: !!isFav };
          })
        );

        res.json({ beats: beatsWithFavStatus });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
});

router.get("/getStudio", (req, res) => {
  Studio.find()
    .then((studio) => {
      res.json({ studio });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.post("/postBeat", (req, res) => {
  upload.single("beats")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      return res.status(400).json({ msg: "Error uploading file" });
    } else if (err) {
      // An unknown error occurred
      console.log(err);
      return res.status(500).json({ msg: "Internal Server Error" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filePath = path.join("./upload/freebeats", req.file.filename);

    const cloudinaryResult = await cloudinary.uploader
      .upload(filePath, {
        resource_type: "raw",
        public_id: `AudioUploads/${req.file.filename}`,
      })
      .catch((error) => {
        console.log(error);
        console.error(error.message);
        return res
          .status(500)
          .json({ msg: "Internal Server Error", error: error.message });
      });

    res.status(200).json({
      msg: "Upload successfully",
      beatUrl: cloudinaryResult.secure_url,
    });
  });
});

router.post("/uploadImage", (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      return res.status(400).json({ msg: "Error uploading file" });
    } else if (err) {
      // An unknown error occurred
      console.log(err);
      return res.status(500).json({ msg: "Internal Server Error" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filePath = path.join("./upload/freebeats", req.file.filename);

    const cloudinaryResult = await cloudinary.uploader
      .upload(filePath, {
        public_id: `Image/${req.file.filename}`,
      })
      .catch((error) => {
        console.log(error);
        console.error(error.message);
        return res
          .status(500)
          .json({ msg: "Internal Server Error", error: error.message });
      });

    User.find();

    res.status(200).json({
      msg: "Upload successfully",
      imageUrl: cloudinaryResult.secure_url,
    });
  });
});

router.post("/changeProfileImage", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "marasini", (err, authData) => {
    if (err) {
      res.status(401).json({
        error: "token is not valid",
      });
    } else {
      upload.single("image")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred during file upload
          return res.status(400).json({ msg: "Error uploading file" });
        } else if (err) {
          // An unknown error occurred
          console.log(err);
          return res.status(500).json({ msg: "Internal Server Error" });
        }

        if (!req.file) {
          return res.status(400).json({ msg: "No file uploaded" });
        }

        const filePath = path.join("./upload/freebeats", req.file.filename);

        const cloudinaryResult = await cloudinary.uploader
          .upload(filePath, {
            public_id: `Image/${req.file.filename}`,
          })
          .catch((error) => {
            console.log(error);
            console.error(error.message);
            return res
              .status(500)
              .json({ msg: "Internal Server Error", error: error.message });
          });

        User.findOneAndUpdate(
          { _id: authData["id"] },
          { imageUrl: cloudinaryResult.secure_url }
        )
          .exec()
          .then((user) => {
            if (!user) {
              return res.status(401).json({
                error: "User does not exist",
              });
            } else {
              res.status(200).json({
                msg: "Upload successfully",
                imageUrl: cloudinaryResult.secure_url,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      });
    }
  });
});

router.post("/uploadBeat", (req, res, next) => {
  const beat = new Beat({
    _id: new mongoose.Types.ObjectId(),
    beatName: req.body.beatName,
    producerName: req.body.producerName,
    beatUrl: req.body.beatUrl,
    imageUrl: req.body.imageUrl,
  });
  beat
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Beat Uploaded Sucesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
});
router.post("/addStudio", (req, res, next) => {
  const studio = new Studio({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    rating: 2,
  });
  studio
    .save()
    .then((result) => {
      res.status(200).json({
        message: "studio added Sucesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
});

router.get("/getFreeBeats");

module.exports = router;
