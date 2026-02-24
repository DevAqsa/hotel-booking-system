import { useState, useEffect } from "react";
import axios from "axios";

function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/bookings/history/${user.username}`);
      setBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load history");
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) return <p className="loading">Loading history...</p>;

  return (
    <div className="booking-history-page">
      <h1>Booking History</h1>

      <div className="filter-tabs">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All ({bookings.length})
        </button>
        <button
          className={filter === "confirmed" ? "active" : ""}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed ({bookings.filter(b => b.status === "confirmed").length})
        </button>
        <button
          className={filter === "cancelled" ? "active" : ""}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled ({bookings.filter(b => b.status === "cancelled").length})
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No booking history</h3>
          <p>Your booking history will appear here.</p>
        </div>
      ) : (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Status</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.hotel_name}</td>
                  <td className="capitalize">{booking.room_type}</td>
                  <td>{booking.check_in} - {booking.check_out}</td>
                  <td>${booking.total_price}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.booked_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingHistory;