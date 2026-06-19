const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: "User registered successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  });
};