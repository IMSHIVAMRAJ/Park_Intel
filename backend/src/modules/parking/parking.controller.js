const pool = require("../../config/db");
const redis = require("../../config/redis");

// add a parking lot
exports.addParking = async (req, res) => {
    const { name , lat , lng , total_slots, price_per_hour } = req.body;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.query(
            "INSERT INTO parking_lots (name, lat, lng, total_slots,available_slots, price_per_hour) VALUES (?, ?, ?, ?, ?, ?)",
            [name, lat, lng, total_slots, total_slots, price_per_hour] );
    const parkingId = result.insertId;

    // redis geo add
 await redis.geoAdd(
      "parking_locations",
      { longitude: lng, latitude: lat, member: parkingId.toString() }
    );
    await conn.commit();
    res.json({ message: "Parking added", parkingId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// 📍 Find nearby parking
exports.nearbyParking = async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;

  const ids = await redis.geoSearch(
    "parking_locations",
    { longitude: lng, latitude: lat },
    { radius, unit: "km" }
  );
  
  if (!ids.length) return res.json([]);

  const [rows] = await pool.query(
    `SELECT * FROM parking_lots WHERE id IN (?)`,
    [ids]
  );

  res.json(rows);
};