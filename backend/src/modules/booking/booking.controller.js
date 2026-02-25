const pool = require("../../config/db");
const policyService = require("../../services/policy.service");
/**
 * 🚗 START PARKING
 */
exports.startParking = async (req, res) => {
  const { parking_id, vehicle_number } = req.body;

  if (!parking_id || !vehicle_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 🔒 Lock parking row
    const [[parking]] = await conn.query(
      "SELECT available_slots FROM parking_lots WHERE id = ? FOR UPDATE",
      [parking_id]
    );

    if (!parking) {
      throw new Error("Parking not found");
    }

    if (parking.available_slots <= 0) {
      throw new Error("No slots available");
    }

    // 🚫 Prevent duplicate active booking for same vehicle
    const [[existing]] = await conn.query(
      "SELECT id FROM bookings WHERE vehicle_number = ? AND status = 'ACTIVE'",
      [vehicle_number]
    );

    if (existing) {
      throw new Error("Vehicle already has active booking");
    }
   const user_id = req.user.id;

    // 📝 Create booking
    const [booking] = await conn.query(
      `INSERT INTO bookings (parking_id, vehicle_number, entry_time, user_id)
       VALUES (?, ?, NOW(), ?)`,
      [parking_id, vehicle_number,user_id]
    );

    // ➖ Decrease slot
    await conn.query(
      "UPDATE parking_lots SET available_slots = available_slots - 1 WHERE id = ?",
      [parking_id]
    );

    await conn.commit();

    res.json({
      message: "Parking started",
      bookingId: booking.insertId,
    });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};


/**
 * 🚘 END PARKING
 */
exports.endParking = async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: "Booking ID required" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 🔒 Lock booking row
    const [[booking]] = await conn.query(
      `SELECT b.*, p.price_per_hour 
       FROM bookings b
       JOIN parking_lots p ON b.parking_id = p.id
       WHERE b.id = ? AND b.status = 'ACTIVE'
       FOR UPDATE`,
      [booking_id]
    );

    if (!booking) {
      throw new Error("Invalid or already completed booking");
    }

    const exitTime = new Date();
    const entryTime = new Date(booking.entry_time);

    const diffInMs = exitTime - entryTime;

    // ⏱ Minimum 1 hour billing
    const hours = Math.max(
      1,
      Math.ceil(diffInMs / (1000 * 60 * 60))
    );

    const amount = hours * booking.price_per_hour;

    // 📝 Update booking
    await conn.query(
      `UPDATE bookings 
       SET exit_time = NOW(), total_amount = ?, status = 'COMPLETED'
       WHERE id = ?`,
      [amount, booking_id]
    );

    // ➕ Free slot
    await conn.query(
      "UPDATE parking_lots SET available_slots = available_slots + 1 WHERE id = ?",
      [booking.parking_id]
    );

    await conn.commit();

    // 🔥 Fire-and-forget policy processing (non-blocking)
    policyService.processExit({
      booking_id,
      vehicle_number: booking.vehicle_number,
      exit_time: exitTime,
      hours,
      amount,
    }).catch(err => console.error("Policy error:", err));

    res.json({
      message: "Parking ended",
      hours,
      amount,
    });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};

exports.myBookings = async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await pool.query(
    "SELECT * FROM bookings WHERE user_id = ?",
    [user_id]
  );

  res.json(rows);
};
//AUTOEXIT 
exports.autoExit = async (req, res) => {
  const { vehicle_number } = req.body;

  if (!vehicle_number) {
    return res.status(400).json({ error: "Vehicle number required" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [[booking]] = await conn.query(
      `SELECT b.*, p.price_per_hour 
       FROM bookings b
       JOIN parking_lots p ON b.parking_id = p.id
       WHERE b.vehicle_number = ? 
       AND b.status = 'ACTIVE'
       FOR UPDATE`,
      [vehicle_number]
    );

    if (!booking) {
      throw new Error("No active booking found");
    }

    const exitTime = new Date();
    const entryTime = new Date(booking.entry_time);

    const diffInMs = exitTime - entryTime;
    const hours = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60)));
    const amount = hours * booking.price_per_hour;

    await conn.query(
      `UPDATE bookings 
       SET exit_time = NOW(), total_amount = ?, status = 'COMPLETED'
       WHERE id = ?`,
      [amount, booking.id]
    );

    await conn.query(
      "UPDATE parking_lots SET available_slots = available_slots + 1 WHERE id = ?",
      [booking.parking_id]
    );

    await conn.commit();

    // fire policy
    policyService.processExit({
      booking_id: booking.id,
      vehicle_number,
      hours,
      amount
    }).catch(console.error);

    res.json({
      message: "Auto exit successful",
      hours,
      amount
    });

  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
};
