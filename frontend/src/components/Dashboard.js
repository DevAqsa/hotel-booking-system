import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      {/* Header Section */}
      <div className="dashboard-header-section">
        <div className="header-content">
          <div className="welcome-text">
            <p className="greeting">{getGreeting()}</p>
            <h1>{user.name}!</h1>
            <p className="subtitle">Here's what's happening with your bookings</p>
          </div>
          <div className="header-actions">
            <button className="btn-book-now" onClick={() => navigate("/hotels")}>
              <span>+</span> Book New Hotel
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats-section">
        <div className="stat-card-modern gradient-blue">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Bookings</p>
            <h2 className="stat-value">{stats.active_bookings}</h2>
            <p className="stat-change positive">Currently staying</p>
          </div>
        </div>

        <div className="stat-card-modern gradient-purple">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Bookings</p>
            <h2 className="stat-value">{stats.total_bookings}</h2>
            <p className="stat-change">All time</p>
          </div>
        </div>

        <div className="stat-card-modern gradient-green">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spent</p>
            <h2 className="stat-value">${stats.total_spent}</h2>
            <p className="stat-change">Lifetime value</p>
          </div>
        </div>

        <div className="stat-card-modern gradient-pink">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Wishlist Items</p>
            <h2 className="stat-value">{stats.wishlist_count}</h2>
            <p className="stat-change">Saved hotels</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Quick Actions */}
        <div className="quick-actions-modern">
          <h3>Quick Actions</h3>
          <div className="actions-grid-modern">
            <Link to="/hotels" className="action-card-modern">
              <div className="action-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div className="action-text">
                <h4>Browse Hotels</h4>
                <p>Explore available hotels</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/my-bookings" className="action-card-modern">
              <div className="action-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="action-text">
                <h4>My Bookings</h4>
                <p>Manage reservations</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/wishlist" className="action-card-modern">
              <div className="action-icon pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <div className="action-text">
                <h4>Wishlist</h4>
                <p>View saved hotels</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/booking-history" className="action-card-modern">
              <div className="action-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div className="action-text">
                <h4>History</h4>
                <p>Past bookings</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/profile" className="action-card-modern">
              <div className="action-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="action-text">
                <h4>Profile</h4>
                <p>Account settings</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings-modern">
          <div className="section-header-modern">
            <h3>Recent Bookings</h3>
            <Link to="/my-bookings" className="view-all-link">View All →</Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-illustration">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" fill="#f0f4ff"/>
                  <path d="M70 90h60v50H70z" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                  <path d="M80 90V70a20 20 0 0140 0v20" stroke="#6366f1" strokeWidth="2" fill="none"/>
                  <circle cx="100" cy="115" r="8" fill="#6366f1"/>
                  <path d="M100 123v12" stroke="#6366f1" strokeWidth="2"/>
                </svg>
              </div>
              <h4>No bookings yet</h4>
              <p>Start exploring hotels and make your first booking!</p>
              <button onClick={() => navigate("/hotels")} className="btn-explore">
                Explore Hotels
              </button>
            </div>
          ) : (
            <div className="bookings-list-modern">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item-modern">
                  <div className="booking-image">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop"
                      alt={booking.hotel_name}
                    />
                  </div>
                  <div className="booking-info-modern">
                    <h4>{booking.hotel_name}</h4>
                    <p className="booking-room">{booking.room_type} Room • {booking.guests} Guests</p>
                    <p className="booking-dates-modern">
                      <span className="date-icon">📅</span>
                      {booking.check_in} → {booking.check_out}
                    </p>
                  </div>
                  <div className="booking-meta">
                    <span className="booking-price-modern">${booking.total_price}</span>
                    <span className={`booking-status-modern ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <div className="promo-text">
            <h3>🎉 Special Offer!</h3>
            <p>Get 20% off on your next booking. Use code: <strong>STAYEASE20</strong></p>
          </div>
          <button onClick={() => navigate("/hotels")} className="promo-btn">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;