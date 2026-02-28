const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");


/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "Vehicle image required",
      });
    }

    const imagePath = req.file.path;

    // 🔥 OCR CALL
    const formData = new FormData();
    formData.append("file", fs.readFileSync(imagePath), {
  filename: "plate.jpg"
});

    const ocrResponse = await axios.post(
      // "https://park-intel-1.onrender.com/ocr",
      "http://localhost:8000/ocr",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(imagePath);

    console.log("Raw OCR:", ocrResponse.data.vehicle_number);

   const vehicle_number = ocrResponse.data.vehicle_number;


    console.log("Final vehicle number:", vehicle_number);

    if (!vehicle_number || vehicle_number.trim() === "") {
      return res.status(400).json({
        error: "Vehicle number not detected from image",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, vehicle_number)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, vehicle_number]
    );

    res.json({
      message: "User registered successfully",
      vehicle_number,
    });

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};