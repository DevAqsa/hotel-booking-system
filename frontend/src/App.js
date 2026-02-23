import { useState } from "react";
import HotelList from "./components/HotelList";
import BookingForm from "./components/BookingForm";
import "./App.css";

function App() {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

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
    <div className="app">
      <h1>🏨 Hotel Booking System</h1>

      {bookingSuccess ? (
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
      )}
    </div>
  );
}

export default App;