import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const BookingPage = () => {
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [players, setPlayers] = useState([{ name: "", email: "" }]);
  const [totalCost, setTotalCost] = useState(0);
  const [costPerPlayer, setCostPerPlayer] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCourts();
    }
    // eslint-disable-next-line
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await api.get("/courts");
      setCourts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load courts");
    }
  };

  const fetchSlots = async (courtId, dateValue) => {
    if (!courtId || !dateValue) return;
    try {
      const res = await api.get(`/courts/${courtId}/slots`, {
        params: { date: dateValue }
      });
      setAvailableSlots(res.data.slots);
      setSelectedSlot("");
    } catch (err) {
      console.error(err);
      setError("Failed to load slots");
    }
  };

  const handleCourtChange = (e) => {
    const courtId = e.target.value;
    setSelectedCourtId(courtId);
    if (courtId && date) {
      fetchSlots(courtId, date);
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDate(value);
    if (selectedCourtId && value) {
      fetchSlots(selectedCourtId, value);
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: "", email: "" }]);
  };

  const removePlayer = (index) => {
    if (players.length === 1) return;
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
  };

  // Recalculate cost whenever court / players / slot change
  useEffect(() => {
    const court = courts.find((c) => c.id === selectedCourtId);
    const numPlayers = players.filter((p) => p.name || p.email).length;

    if (court && selectedSlot && numPlayers > 0) {
      const hours = 1; // each slot is 1 hour
      const total = court.pricePerHour * hours;
      const perPlayer = total / numPlayers;
      setTotalCost(total);
      setCostPerPlayer(perPlayer);
    } else {
      setTotalCost(0);
      setCostPerPlayer(0);
    }
  }, [courts, selectedCourtId, selectedSlot, players]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validPlayers = players.filter((p) => p.name || p.email);

    if (!selectedCourtId || !date || !selectedSlot || !validPlayers.length) {
      setError("Please fill all booking details and add at least one player");
      return;
    }

    try {
      const res = await api.post("/bookings", {
        courtId: selectedCourtId,
        date,
        slot: selectedSlot,
        players: validPlayers
      });

      setMessage("Booking successful!");
      setError("");
      console.log("Booked:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Book a Badminton Court</h2>

      <form onSubmit={handleSubmit}>
        {/* Date */}
        <div style={{ marginBottom: 10 }}>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            required
            style={{ display: "block", width: "100%" }}
          />
        </div>

        {/* Court selection */}
        <div style={{ marginBottom: 10 }}>
          <label>Court</label>
          <select
            value={selectedCourtId}
            onChange={handleCourtChange}
            required
            style={{ display: "block", width: "100%" }}
          >
            <option value="">-- Select Court --</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (₹{c.pricePerHour}/hr)
              </option>
            ))}
          </select>
        </div>

        {/* Slot selection */}
        <div style={{ marginBottom: 10 }}>
          <label>Available Slots</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 5 }}>
            {availableSlots.length === 0 && (
              <span style={{ fontSize: 14, color: "#555" }}>
                Select date & court to see available slots.
              </span>
            )}
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: "4px 10px",
                  border:
                    selectedSlot === slot
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
                  borderRadius: 4
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div style={{ marginBottom: 10 }}>
          <label>Players</label>
          {players.map((player, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: 8,
                marginTop: 5,
                alignItems: "center"
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={player.name}
                onChange={(e) =>
                  handlePlayerChange(index, "name", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <input
                type="email"
                placeholder="Email"
                value={player.email}
                onChange={(e) =>
                  handlePlayerChange(index, "email", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => removePlayer(index)}>
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addPlayer} style={{ marginTop: 5 }}>
            + Add Player
          </button>
        </div>

        {/* Cost summary */}
        <div
          style={{
            margin: "15px 0",
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 4
          }}
        >
          <p>
            <strong>Total Cost:</strong>{" "}
            {totalCost ? `₹${totalCost.toFixed(2)}` : "-"}
          </p>
          <p>
            <strong>Per Player Cost:</strong>{" "}
            {costPerPlayer ? `₹${costPerPlayer.toFixed(2)}` : "-"}
          </p>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit" style={{ padding: "8px 16px" }}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
