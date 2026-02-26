import { useState, useEffect } from "react";
import axios from "axios";

function BookingForm({ hotel, user, onBack, onBookingComplete }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(hotel);
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    guests: 1,
    card_number: "",
    card_expiration: "",
    card_holder: "",
    card_cvc: "",
    card_password: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [hotel]);

  useEffect(() => {
    calculatePrice();
  }, [formData.check_in, formData.check_out, selectedRoom]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/hotels/rooms/${encodeURIComponent(hotel.name)}`
      );
      setRooms(response.data.rooms);
    } catch (err) {
      console.error("Failed to load rooms");
    }
  };

  const calculatePrice = () => {
    if (formData.check_in && formData.check_out && selectedRoom) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const diffTime = checkOut - checkIn;
      const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffNights > 0) {
        setNights(diffNights);
        setTotalPrice(diffNights * parseFloat(selectedRoom.price_per_night));
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to book");
      return;
    }

    if (nights <= 0) {
      setError("Please select valid dates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/book", {
        username: user.username,
        hotel_id: selectedRoom.id,
        hotel_name: selectedRoom.name,
        room_type: selectedRoom.room_type,
        check_in: formData.check_in,
        check_out: formData.check_out,
        guests: parseInt(formData.guests),
        total_price: totalPrice,
        card_number: formData.card_number,
        card_expiration: formData.card_expiration,
        card_holder: formData.card_holder,
        card_cvc: formData.card_cvc,
        card_password: formData.card_password,
      });

      if (response.data.success) {
        onBookingComplete(response.data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-form-container">
      <button className="back-btn" onClick={onBack}>← Back to Hotels</button>

      <div className="booking-layout">
        {/* Left: Room Selection */}
        <div className="room-selection">
          <h2>Select Room Type</h2>
          <div className="rooms-list">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`room-card ${selectedRoom?.id === room.id ? "selected" : ""} ${room.available !== "yes" ? "unavailable" : ""}`}
                onClick={() => room.available === "yes" && handleRoomSelect(room)}
              >
                <div className="room-type-badge">{room.room_type}</div>
                <div className="room-details">
                  <p>👥 Up to {room.capacity} guests</p>
                  <p className="room-price">${room.price_per_night}/night</p>
                </div>
                {room.available !== "yes" && <span className="sold-out">Sold Out</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="booking-form">
          <h2>Book: {hotel.name}</h2>
          <p className="selected-room">Room: {selectedRoom?.room_type} - ${selectedRoom?.price_per_night}/night</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Dates */}
            <div className="form-row">
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  min={formData.check_in || today}
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="form-group">
              <label>Number of Guests</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              >
                {[...Array(selectedRoom?.capacity || 4)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="price-summary">
                <div className="price-row">
                  <span>${selectedRoom?.price_per_night} x {nights} night{nights > 1 ? "s" : ""}</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}

            <hr />

            {/* Payment Details */}
            <h3>Payment Details</h3>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="card_number"
                value={formData.card_number}
                onChange={handleChange}
                placeholder="1234567890123456"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiration</label>
                <input
                  type="text"
                  name="card_expiration"
                  value={formData.card_expiration}
                  onChange={handleChange}
                  placeholder="12/26"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVC</label>
                <input
                  type="text"
                  name="card_cvc"
                  value={formData.card_cvc}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                name="card_holder"
                value={formData.card_holder}
                onChange={handleChange}
                placeholder="JOHN SMITH"
                required
              />
            </div>

            <div className="form-group">
              <label>Card Password</label>
              <input
                type="password"
                name="card_password"
                value={formData.card_password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" disabled={loading || nights <= 0}>
              {loading ? "Processing..." : `Pay $${totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;