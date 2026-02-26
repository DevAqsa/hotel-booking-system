import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import HotelList from "./components/HotelList";
import BookingForm from "./components/BookingForm";
import MyBookings from "./components/MyBookings";
import BookingHistory from "./components/BookingHistory";
import Wishlist from "./components/Wishlist";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedHotel(null);
    setBookingSuccess(null);
  };

  const handleUpdateUser = (userData) => {
    setUser(userData);
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setBookingSuccess(null);
  };

  const handleBookingComplete = (booking) => {
    setBookingSuccess(booking);
    setSelectedHotel(null);
  };

  const handleBack = () => {
    setSelectedHotel(null);
    setBookingSuccess(null);
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/hotels" element={
            bookingSuccess ? (
              <div className="success-message">
                <h2>✅ Booking Confirmed!</h2>
                <p><strong>Booking ID:</strong> #{bookingSuccess.id}</p>
                <p><strong>Hotel:</strong> {bookingSuccess.hotel_name}</p>
                <p><strong>Room:</strong> {bookingSuccess.room_type}</p>
                <p><strong>Check-in:</strong> {bookingSuccess.check_in}</p>
                <p><strong>Check-out:</strong> {bookingSuccess.check_out}</p>
                <p><strong>Total:</strong> ${bookingSuccess.total_price}</p>
                <button onClick={handleBack}>Book Another Hotel</button>
              </div>
            ) : selectedHotel ? (
              <BookingForm
                hotel={selectedHotel}
                user={user}
                onBack={handleBack}
                onBookingComplete={handleBookingComplete}
              />
            ) : (
              <HotelList user={user} onSelectHotel={handleSelectHotel} />
            )
          } />

          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings user={user} />
            </ProtectedRoute>
          } />

          <Route path="/booking-history" element={
            <ProtectedRoute>
              <BookingHistory user={user} />
            </ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist user={user} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile user={user} onUpdateUser={handleUpdateUser} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;