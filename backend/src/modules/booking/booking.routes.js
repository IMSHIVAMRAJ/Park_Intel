const express = require("express");
const router = express.Router();
const controller = require("./booking.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/start", auth, controller.startParking);
router.post("/end", auth, controller.endParking);
router.get("/my", auth, controller.myBookings);
router.post("/auto-exit", controller.autoExit);

module.exports = router;
