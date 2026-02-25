const express = require("express");
const router = express.Router();
const controller = require("./fine.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/pay", auth, controller.payFine);
router.get("/my", auth, controller.myFines);

module.exports = router;
