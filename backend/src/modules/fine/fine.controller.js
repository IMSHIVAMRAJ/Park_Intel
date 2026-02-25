const pool = require("../../config/db");

exports.payFine = async (req, res) => {
  const { fine_id } = req.body;

  if (!fine_id) {
    return res.status(400).json({ error: "Fine ID required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE fines SET status = 'PAID' WHERE id = ? AND status = 'PENDING'",
      [fine_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Invalid or already paid fine" });
    }

    res.json({
      message: "Fine paid successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.myFines = async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await pool.query(
    `SELECT f.* 
     FROM fines f
     JOIN bookings b ON f.booking_id = b.id
     WHERE b.user_id = ?`,
    [user_id]
  );

  res.json(rows);
};
