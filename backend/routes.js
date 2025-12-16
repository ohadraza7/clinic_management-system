import express from "express";
import db from "../config/db.js"; // MySQL connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// -------------------------------
// LOGIN USER
// -------------------------------
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Check user in DB
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB Error" });

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      // Create Token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        "mysecretkey",
        { expiresIn: "30d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

export default router;
