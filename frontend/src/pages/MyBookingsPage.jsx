import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchBookings();
    }
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookings.length === 0 && !error && (
        <p>No bookings yet. Go book a court!</p>
      )}
      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 10,
            marginBottom: 10
          }}
        >
          <p>
            <strong>Court:</strong> {b.courtName} ({b.courtId})
          </p>
          <p>
            <strong>Date:</strong> {b.date}
          </p>
          <p>
            <strong>Slot:</strong> {b.slot}
          </p>
          <p>
            <strong>Total Cost:</strong> ₹{b.totalCost.toFixed(2)} |{" "}
            <strong>Per Player:</strong> ₹{b.costPerPlayer.toFixed(2)}
          </p>
          <p>
            <strong>Players:</strong>{" "}
            {b.players.map((p) => p.name || p.email).join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyBookingsPage;
