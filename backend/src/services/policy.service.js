const pool = require("../config/db");

exports.processExit = async ({
  booking_id,
  vehicle_number,
  hours,
  amount
}) => {
  console.log("🔍 Running policy checks...");

  const MAX_ALLOWED_HOURS = 8;
  const OVERSTAY_FINE_PER_HOUR = 100;

  if (hours > MAX_ALLOWED_HOURS) {
    const extraHours = hours - MAX_ALLOWED_HOURS;
    const fineAmount = extraHours * OVERSTAY_FINE_PER_HOUR;

    await pool.query(
      `INSERT INTO fines (booking_id, vehicle_number, fine_amount, reason)
       VALUES (?, ?, ?, ?)`,
      [
        booking_id,
        vehicle_number,
        fineAmount,
        `Overstay by ${extraHours} hour(s)`
      ]
    );

    console.log(`⚠️ Fine Applied: ₹${fineAmount}`);
  } else {
    console.log("✅ No overstay detected");
  }

  console.log(
    `🚘 Booking #${booking_id} processed successfully`
  );
};
