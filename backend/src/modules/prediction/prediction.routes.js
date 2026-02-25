const express = require("express");
const router = express.Router();
const predictionController = require("./prediction.controller");

router.post("/", predictionController.getPrediction);

module.exports = router;