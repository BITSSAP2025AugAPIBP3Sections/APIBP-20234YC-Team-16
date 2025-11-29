const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const users = readJSON("users.json");
  const { name, email, password } = req.body;

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    passwordHash
  };

  users.push(newUser);
  writeJSON("users.json", users);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token, user: newUser });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const users = readJSON("users.json");
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token, user });
});

module.exports = router;
