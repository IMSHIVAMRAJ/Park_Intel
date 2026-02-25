const express = require('express')
const cors = require("cors");
const parkingRoutes = require('./modules/parking/parking.routes')
const bookingRoutes = require("./modules/booking/booking.routes");
const fineRoutes = require("./modules/fine/fine.routes");
const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const ocrRoutes = require("./modules/ocr/ocr.routes");
const predictionRoutes = require("./modules/prediction/prediction.routes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("🚗 Park-Intel Backend Running");
});
app.use("/api/parking", parkingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/fine", fineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/prediction", predictionRoutes);

module.exports = app;