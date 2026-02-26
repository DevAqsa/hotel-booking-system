import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/wishlist/${user.username}`);
      setWishlist(response.data.wishlist);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load wishlist");
      setLoading(false);
    }
  };

  const handleRemove = async (hotelId) => {
    try {
      await axios.post("http://localhost:8000/wishlist/remove", {
        username: user.username,
        hotel_id: hotelId
      });
      setWishlist(wishlist.filter(h => h.id !== hotelId));
    } catch (err) {
      alert("Failed to remove from wishlist");
    }
  };

  if (loading) return <p className="loading">Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h1>My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save hotels you love to book them later!</p>
          <a href="/hotels" className="btn-primary">Browse Hotels</a>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((hotel) => (
            <div key={hotel.id} className="wishlist-card">
              <div className="wishlist-image">🏨</div>
              <div className="wishlist-info">
                <h3>{hotel.name}</h3>
                <p className="city">📍 {hotel.city}</p>
                <p className="price">${hotel.price_per_night}/night</p>
                <div className="rating">⭐ {hotel.rating}</div>
              </div>
              <div className="wishlist-actions">
                <button
                  className="btn-book"
                  onClick={() => navigate("/hotels")}
                >
                  Book Now
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(hotel.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;