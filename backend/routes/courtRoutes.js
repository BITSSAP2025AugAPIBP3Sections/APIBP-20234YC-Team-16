const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { readJSON } = require("../utils/fileHandler");

const router = express.Router();

const allSlots = [
  "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
  "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"
];

/**
 * @swagger
 * /api/courts:
 *   get:
 *     summary: Get all courts
 *     description: Retrieve a list of all available badminton courts
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Court'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authMiddleware, (req, res) => {
  const courts = readJSON("courts.json");
  res.json(courts);
});

/**
 * @swagger
 * /api/courts/{id}/slots:
 *   get:
 *     summary: Get available slots for a court
 *     description: Retrieve available time slots for a specific court on a given date
 *     tags: [Courts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Court ID
 *         example: court-1
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for which to check availability (YYYY-MM-DD)
 *         example: 2024-12-01
 *     responses:
 *       200:
 *         description: Available slots for the court
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SlotsResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
/**
 * @swagger
 * /api/courts/{id}/today:
 *   get:
 *     summary: Get available slots for a court TODAY
 *     tags: [Courts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: court-1
 *     responses:
 *       200:
 *         description: Available slots today
 */
router.get("/:id/today", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const courts = await readJSON("courts.json");
    if (!courts.some(c => c.id === id)) {
      return res.status(404).json({ error: "Court not found" });
    }

    const bookings = await readJSON("bookings.json");
    const bookedToday = bookings
      .filter(b => b.courtId === id && b.date === today)
      .map(b => b.slot);

    const availableToday = ALL_SLOTS.filter(slot => !bookedToday.includes(slot));

    res.json({
      courtId: id,
      date: today,
      message: availableToday.length > 0 
        ? `${availableToday.length} slots available today!` 
        : "No slots available today",
      availableSlots: availableToday
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to check today's slots" });
  }
});
