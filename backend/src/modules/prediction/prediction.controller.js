const pool = require("../../config/db");
const axios = require("axios");

exports.getPrediction = async (req, res) => {
  const { parking_id, day, hour } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT available_slots, total_slots
FROM occupancy_logs
WHERE DAYNAME(log_time) = ?
AND HOUR(log_time) = ?
ORDER BY log_time DESC
LIMIT 8`,
      [day, hour]
    );

    if (rows.length === 0) {
      return res.json({ message: "Not enough historical data" });
    }

    const totalSlots = rows[0].total_slots;

    const avg =
      rows.reduce((sum, r) => sum + r.available_slots, 0) / rows.length;

    const percentage = (avg / totalSlots) * 100;

    // 🔥 Gemini AI Service Call
    const aiResponse = await axios.post(
      "http://127.0.0.1:8001/predict",
      {
        totalSlots,
        averageAvailable: avg,
        percentage,
        day,
        hour
      }
    );

    return res.json(aiResponse.data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Prediction failed" });
  }
};