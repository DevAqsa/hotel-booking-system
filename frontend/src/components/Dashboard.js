import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    active_bookings: 0,
    total_bookings: 0,
    total_spent: 0,
    wishlist_count: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        axios.get(`http://localhost:8000/dashboard/stats/${user.username}`),
        axios.get(`http://localhost:8000/bookings/${user.username}`)
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.bookings.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's your booking overview</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏨</div>
          <div className="stat-info">
            <h3>{stats.active_bookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.total_bookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${stats.total_spent}</h3>
            <p>Total Spent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <h3>{stats.wishlist_count}</h3>
            <p>Wishlist Items</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/hotels" className="action-card">
            <span className="action-icon">🔍</span>
            <span>Browse Hotels</span>
          </Link>
          <Link to="/my-bookings" className="action-card">
            <span className="action-icon">📅</span>
            <span>My Bookings</span>
          </Link>
          <Link to="/wishlist" className="action-card">
            <span className="action-icon">❤️</span>
            <span>Wishlist</span>
          </Link>
          <Link to="/profile" className="action-card">
            <span className="action-icon">👤</span>
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <Link to="/my-bookings">View All</Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings yet. Start exploring hotels!</p>
            <Link to="/hotels" className="btn-primary">Browse Hotels</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-icon">🏨</div>
                <div className="booking-details">
                  <h4>{booking.hotel_name}</h4>
                  <p>{booking.room_type} • {booking.guests} guests</p>
                  <p className="booking-dates">
                    {booking.check_in} → {booking.check_out}
                  </p>
                </div>
                <div className="booking-price">
                  <span className="price">${booking.total_price}</span>
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;