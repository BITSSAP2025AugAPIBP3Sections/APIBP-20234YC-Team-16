import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./BookingPage.css";

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
    <div className="booking-container">
      <div className="booking-card">
        <h2 className="booking-title">Book a Badminton Court</h2>

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              required
              className="form-input"
            />
          </div>

          {/* Court selection */}
          <div className="form-group">
            <label className="form-label">Court</label>
            <select
              value={selectedCourtId}
              onChange={handleCourtChange}
              required
              className="form-select"
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
          <div className="form-group">
            <label className="form-label">Available Slots</label>
            <div className="slots-container">
              {availableSlots.length === 0 && (
                <span className="empty-slots">
                  Select date & court to see available slots.
                </span>
              )}
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`slot-button ${selectedSlot === slot ? "selected" : ""}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Players */}
          <div className="form-group">
            <label className="form-label">Players</label>
            <div className="players-section">
              {players.map((player, index) => (
                <div key={index} className="player-row">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={player.name}
                    onChange={(e) =>
                      handlePlayerChange(index, "name", e.target.value)
                    }
                    className="player-input"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={player.email}
                    onChange={(e) =>
                      handlePlayerChange(index, "email", e.target.value)
                    }
                    className="player-input"
                  />
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="remove-player-button"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addPlayer} className="add-player-button">
                Add Player
              </button>
            </div>
          </div>

          {/* Cost summary */}
          <div className="cost-summary">
            <div className="cost-row">
              <span className="cost-label">Total Cost:</span>
              <span className="cost-value">
                {totalCost ? `₹${totalCost.toFixed(2)}` : "-"}
              </span>
            </div>
            <div className="cost-row">
              <span className="cost-label">Per Player Cost:</span>
              <span className="cost-value">
                {costPerPlayer ? `₹${costPerPlayer.toFixed(2)}` : "-"}
              </span>
            </div>
          </div>

          {error && <p className="message error-message">{error}</p>}
          {message && <p className="message success-message">{message}</p>}

          <button type="submit" className="submit-button">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
