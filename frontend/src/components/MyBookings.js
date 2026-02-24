import { useState, useEffect } from "react";
import axios from "axios";

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/${user.username}`);
      setBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load bookings");
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(bookingId);
    try {
      await axios.post("http://localhost:8000/bookings/cancel", {
        booking_id: bookingId,
        username: user.username
      });

      // Remove from list
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <p className="loading">Loading bookings...</p>;

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No active bookings</h3>
          <p>You don't have any active bookings at the moment.</p>
          <a href="/hotels" className="btn-primary">Browse Hotels</a>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.hotel_name}</h3>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-info">
                <div className="info-row">
                  <span className="label">📅 Check-in:</span>
                  <span>{booking.check_in}</span>
                </div>
                <div className="info-row">
                  <span className="label">📅 Check-out:</span>
                  <span>{booking.check_out}</span>
                </div>
                <div className="info-row">
                  <span className="label">🛏️ Room Type:</span>
                  <span className="capitalize">{booking.room_type}</span>
                </div>
                <div className="info-row">
                  <span className="label">👥 Guests:</span>
                  <span>{booking.guests}</span>
                </div>
                <div className="info-row">
                  <span className="label">💰 Total:</span>
                  <span className="price">${booking.total_price}</span>
                </div>
              </div>

              <div className="booking-actions">
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancelling === booking.id}
                >
                  {cancelling === booking.id ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;