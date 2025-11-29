const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: String,
    email: String
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courtId: { type: String, required: true },
    courtName: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    slot: { type: String, required: true }, // "06:00-07:00"
    players: [playerSchema],
    totalCost: { type: Number, required: true },
    costPerPlayer: { type: Number, required: true }
  },
  { timestamps: true }
);

bookingSchema.index({ courtId: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
