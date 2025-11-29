const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();

// POST /api/bookings
router.post("/", authMiddleware, (req, res) => {
  const bookings = readJSON("bookings.json");
  const courts = readJSON("courts.json");

  const { courtId, date, slot, players } = req.body;

  // Check if slot already booked
  if (bookings.some(b => b.courtId === courtId && b.date === date && b.slot === slot)) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  const court = courts.find((c) => c.id === courtId);
  const totalCost = court.pricePerHour;
  const costPerPlayer = totalCost / players.length;

  const newBooking = {
    id: Date.now().toString(),
    userId: req.user.id,
    courtId,
    courtName: court.name,
    date,
    slot,
    players,
    totalCost,
    costPerPlayer
  };

  bookings.push(newBooking);
  writeJSON("bookings.json", bookings);

  res.json(newBooking);
});

// GET /api/bookings/my
router.get("/my", authMiddleware, (req, res) => {
  const bookings = readJSON("bookings.json");
  const myBookings = bookings.filter((b) => b.userId === req.user.id);
  res.json(myBookings);
});

module.exports = router;
