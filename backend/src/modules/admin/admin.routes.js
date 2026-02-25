const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");
const auth = require("../../middleware/auth.middleware");
const admin = require("../../middleware/admin.middleware");

router.get("/dashboard", auth, admin, controller.dashboardSummary);
router.get("/revenue/daily", auth, admin, controller.revenuePerDay);
router.get("/revenue/parking", auth, admin, controller.revenuePerParking);

module.exports = router;
