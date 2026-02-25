const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const policyService = require("../../services/policy.service");
const pool = require("../../config/db");

// 🔥 COMMON CLEANING FUNCTION
function cleanVehicleNumber(text) {
  if (!text) return null;

  let cleaned = text
    .toUpperCase()
    .replace(/IND/g, "")          // remove IND
    .replace(/[^A-Z0-9]/g, "")   // remove garbage
    .replace(/L/g, "1")
    .replace(/O/g, "0")
    .replace(/I/g, "1")
    .replace(/S/g, "5")
    .replace(/Z/g, "2")
    .replace(/B/g, "8");

  return cleaned || null;
}

/* ===================== AUTO EXIT ===================== */

exports.autoExitWithOCR = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(
      "http://localhost:8000/ocr",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(imagePath);

    console.log("Raw OCR output:", response.data.vehicle_number);

    const vehicle_number = cleanVehicleNumber(
      response.data.vehicle_number
    );

    console.log("Final vehicle number:", vehicle_number);

    if (!vehicle_number) {
      return res.status(400).json({ error: "Vehicle number not detected" });
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[booking]] = await conn.query(
      `SELECT b.*, p.price_per_hour
       FROM bookings b
       JOIN parking_lots p ON b.parking_id = p.id
       WHERE b.vehicle_number LIKE ?
       AND b.status = 'ACTIVE'
       FOR UPDATE`,
      [vehicle_number + "%"]
    );

    if (!booking) {
      await conn.rollback();
      return res.status(400).json({ error: "No active booking found" });
    }

    const exitTime = new Date();
    const entryTime = new Date(booking.entry_time);
    const hours = Math.max(
      1,
      Math.ceil((exitTime - entryTime) / (1000 * 60 * 60))
    );
    const amount = hours * booking.price_per_hour;

    await conn.query(
      `UPDATE bookings
       SET exit_time = NOW(), total_amount = ?, status = 'COMPLETED'
       WHERE id = ?`,
      [amount, booking.id]
    );

    await conn.query(
      `UPDATE parking_lots
       SET available_slots = available_slots + 1
       WHERE id = ?`,
      [booking.parking_id]
    );

    await conn.commit();

    policyService.processExit({
      booking_id: booking.id,
      vehicle_number,
      hours,
      amount,
    }).catch(console.error);

    res.json({
      message: "Auto exit via OCR successful",
      vehicle_number,
      hours,
      amount,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== AUTO ENTRY ===================== */

exports.autoEntryWithOCR = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const { parking_id } = req.body;

    if (!parking_id) {
      return res.status(400).json({ error: "Parking ID required" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(
      "http://localhost:8000/ocr",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(imagePath);

    console.log("Raw OCR output:", response.data.vehicle_number);

    const vehicle_number = cleanVehicleNumber(
      response.data.vehicle_number
    );

    console.log("Final vehicle number:", vehicle_number);

    if (!vehicle_number) {
      return res.status(400).json({ error: "Vehicle number not detected" });
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    // 🔥 already inside check
    const [[existing]] = await conn.query(
      `SELECT id FROM bookings
       WHERE vehicle_number LIKE ?
       AND status = 'ACTIVE'
       FOR UPDATE`,
      [vehicle_number + "%"]
    );

    if (existing) {
      await conn.rollback();
      return res.json({ message: "Vehicle already inside parking" });
    }

    // 🔥 slot check
    const [[parking]] = await conn.query(
      `SELECT available_slots
       FROM parking_lots
       WHERE id = ?
       FOR UPDATE`,
      [parking_id]
    );

    if (!parking || parking.available_slots <= 0) {
      await conn.rollback();
      return res.status(400).json({ error: "No slots available" });
    }

    // 🔥 vehicle registration check
    const [[user]] = await conn.query(
      `SELECT id FROM users WHERE vehicle_number = ?`,
      [vehicle_number]
    );

    if (!user) {
      await conn.rollback();
      return res.status(400).json({
        error: "Vehicle not registered. Please register first.",
      });
    }

    // 🔥 create booking
    const [booking] = await conn.query(
      `INSERT INTO bookings
       (parking_id, vehicle_number, entry_time, status, user_id)
       VALUES (?, ?, NOW(), 'ACTIVE', ?)`,
      [parking_id, vehicle_number, user.id]
    );

    await conn.query(
      `UPDATE parking_lots
       SET available_slots = available_slots - 1
       WHERE id = ?`,
      [parking_id]
    );

    await conn.commit();

    res.json({
      message: "Auto entry successful",
      bookingId: booking.insertId,
      vehicle_number,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};