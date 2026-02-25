const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/register",
  upload.single("vehicle_image"),
  controller.register
);
router.post("/login", controller.login);

module.exports = router;
