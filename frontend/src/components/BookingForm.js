import { useState } from "react";
import axios from "axios";

function BookingForm({ hotel, onBack, onBookingComplete }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    card_number: "",
    card_expiration: "",
    card_holder: "",
    card_cvc: "",
    card_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/book", {
        hotel_id: hotel.id,
        ...formData,
      });

      if (response.data.success) {
        onBookingComplete(response.data.reservation);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <button className="back-btn" onClick={onBack}>← Back to Hotels</button>

      <h2>Book: {hotel.name}</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

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

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;