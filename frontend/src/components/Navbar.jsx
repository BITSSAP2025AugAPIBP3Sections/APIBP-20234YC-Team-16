import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
      <span style={{ fontWeight: "bold", marginRight: 20 }}>
        Badminton Booking
      </span>
      {token && (
        <>
          <Link to="/book" style={{ marginRight: 10 }}>
            Book Court
          </Link>
          <Link to="/my-bookings" style={{ marginRight: 10 }}>
            My Bookings
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
