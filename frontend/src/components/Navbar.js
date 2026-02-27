import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="nav-logo">
        <span className="logo-icon">🏨</span>
        <span className="logo-text">Stay<span className="logo-highlight">Ease</span></span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/hotels">Hotels</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/wishlist">❤️ Wishlist</Link>

            <div className="nav-user">
              <Link to="/profile" className="user-name">👤 {user.name}</Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/hotels">Hotels</Link>
            <div className="nav-auth">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;