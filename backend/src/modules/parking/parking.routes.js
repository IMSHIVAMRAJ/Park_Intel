const express = require("express");
const router = express.Router();
const controller = require("./parking.controller");

router.post("/add", controller.addParking);
router.get("/nearby", controller.nearbyParking);

module.exports = router;
