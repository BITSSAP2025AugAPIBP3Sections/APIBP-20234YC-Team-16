const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { readJSON } = require("../utils/fileHandler");

const router = express.Router();

const allSlots = [
  "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
  "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"
];

router.get("/", authMiddleware, (req, res) => {
  const courts = readJSON("courts.json");
  res.json(courts);
});

// GET /api/courts/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", authMiddleware, (req, res) => {
  const bookings = readJSON("bookings.json");
  const { id } = req.params;
  const { date } = req.query;

  const booked = bookings
    .filter((b) => b.courtId === id && b.date === date)
    .map((b) => b.slot);

  const availableSlots = allSlots.filter((slot) => !booked.includes(slot));

  res.json({ slots: availableSlots });
});

module.exports = router;
