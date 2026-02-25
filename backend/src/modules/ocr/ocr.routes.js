const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("./ocr.controller");

const upload = multer({ dest: "uploads/" });

router.post("/auto-exit", upload.single("image"), controller.autoExitWithOCR);  
router.post("/auto-entry", upload.single("image"), controller.autoEntryWithOCR);

module.exports = router;
