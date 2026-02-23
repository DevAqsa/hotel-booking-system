import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HotelList from "./components/HotelList";
import BookingForm from "./components/BookingForm";
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
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setBookingSuccess(null);
  };

  const handleBookingComplete = (reservation) => {
    setBookingSuccess(reservation);
    setSelectedHotel(null);
  };

  const handleBack = () => {
    setSelectedHotel(null);
    setBookingSuccess(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route
            path="/hotels"
            element={
              bookingSuccess ? (
                <div className="success-message">
                  <h2>✅ Booking Confirmed!</h2>
                  <p><strong>Name:</strong> {bookingSuccess.customer_name}</p>
                  <p><strong>Hotel:</strong> {bookingSuccess.hotel_name}</p>
                  <button onClick={handleBack}>Book Another Hotel</button>
                </div>
              ) : selectedHotel ? (
                <BookingForm
                  hotel={selectedHotel}
                  onBack={handleBack}
                  onBookingComplete={handleBookingComplete}
                />
              ) : (
                <HotelList onSelectHotel={handleSelectHotel} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;