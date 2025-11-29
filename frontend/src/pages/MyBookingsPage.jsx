import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./MyBookingsPage.css";

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
    <div className="my-bookings-container">
      <div className="my-bookings-card">
        <h2 className="my-bookings-title">My Bookings</h2>
        {error && <p className="error-message">{error}</p>}
        {bookings.length === 0 && !error && (
          <p className="empty-message">No bookings yet. Go book a court!</p>
        )}
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-item">
              <div className="booking-header">
                <span className="court-name">{b.courtName}</span>
                <span className="court-id">{b.courtId}</span>
              </div>
              
              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{b.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Slot</span>
                  <span className="detail-value">{b.slot}</span>
                </div>
              </div>

              <div className="cost-section">
                <div className="cost-item">
                  <span className="cost-label">Total Cost</span>
                  <span className="cost-value">₹{b.totalCost.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                  <span className="cost-label">Per Player</span>
                  <span className="cost-value">₹{b.costPerPlayer.toFixed(2)}</span>
                </div>
              </div>

              <div className="players-section">
                <span className="players-label">Players</span>
                <div className="players-list">
                  {b.players.map((p, idx) => (
                    <span key={idx} className="player-tag">
                      {p.name || p.email}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
