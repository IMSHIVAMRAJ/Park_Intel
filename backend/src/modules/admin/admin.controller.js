const pool = require("../../config/db");

exports.dashboardSummary = async (req, res) => {
  try {
    const [[users]] = await pool.query("SELECT COUNT(*) as total FROM users");
    const [[bookings]] = await pool.query("SELECT COUNT(*) as total FROM bookings");
    const [[activeBookings]] = await pool.query(
      "SELECT COUNT(*) as total FROM bookings WHERE status = 'ACTIVE'"
    );

    const [[revenue]] = await pool.query(
      "SELECT IFNULL(SUM(total_amount),0) as total FROM bookings WHERE status = 'COMPLETED'"
    );

    const [[fineRevenue]] = await pool.query(
      "SELECT IFNULL(SUM(fine_amount),0) as total FROM fines WHERE status = 'PAID'"
    );

    const [[unpaidFines]] = await pool.query(
      "SELECT COUNT(*) as total FROM fines WHERE status = 'PENDING'"
    );

    res.json({
      totalUsers: users.total,
      totalBookings: bookings.total,
      activeBookings: activeBookings.total,
      parkingRevenue: revenue.total,
      fineRevenue: fineRevenue.total,
      unpaidFines: unpaidFines.total,
      totalRevenue: revenue.total + fineRevenue.total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.revenuePerDay = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT DATE(exit_time) as date,
           SUM(total_amount) as revenue
    FROM bookings
    WHERE status = 'COMPLETED'
    GROUP BY DATE(exit_time)
    ORDER BY date DESC
  `);

  res.json(rows);
};

exports.revenuePerParking = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.name,
           SUM(b.total_amount) as revenue
    FROM bookings b
    JOIN parking_lots p ON b.parking_id = p.id
    WHERE b.status = 'COMPLETED'
    GROUP BY p.name
  `);

  res.json(rows);
};
