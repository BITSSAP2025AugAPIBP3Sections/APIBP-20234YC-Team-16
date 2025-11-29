const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Book a badminton court for a specific date and time slot
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       200:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Slot already booked or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Get my bookings
 *     description: Retrieve all bookings made by the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/my", authMiddleware, (req, res) => {
  const bookings = readJSON("bookings.json");
  const myBookings = bookings.filter((b) => b.userId === req.user.id);
  res.json(myBookings);
});

module.exports = router;
