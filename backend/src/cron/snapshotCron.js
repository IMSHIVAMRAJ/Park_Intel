const cron = require("node-cron");
const db = require("../db");

cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running hourly occupancy snapshot...");

    const [parkings] = await db.query(
      "SELECT id, total_slots, available_slots FROM parking_lots"
    );

    for (const parking of parkings) {
      await db.query(
        `INSERT INTO occupancy_logs 
        (parking_id, log_time, total_slots, available_slots)
        VALUES (?, NOW(), ?, ?)`,
        [parking.id, parking.total_slots, parking.available_slots]
      );
    }

    console.log("Snapshot stored ✅");
  } catch (err) {
    console.error("Cron error:", err);
  }
});