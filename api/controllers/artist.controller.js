const express = require("express");
const { model } = require("mongoose");
const mongoose = require("mongoose");
const Artist = require("../models/artist_schema");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const login = async (req, res) => {};

module.exports = { login };
