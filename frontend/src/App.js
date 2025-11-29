import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import "./App.css";

const App = () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        {/* default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;
