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

  const getHotelImage = (name) => {
    const images = {
      "Tourist Sunny Apartment": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      "Snow Palace": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "City Break Inn": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      "Ocean View Resort": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
      "Mountain Lodge": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop"
    };
    return images[name] || "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop";
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
              <div className="wishlist-image-container">
                <img
                  src={getHotelImage(hotel.name)}
                  alt={hotel.name}
                  className="wishlist-img"
                />
              </div>
              <div className="wishlist-info">
                <div className="wishlist-header">
                  <h3>{hotel.name}</h3>
                  <div className="rating">
                    <span className="star">★</span>
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                <p className="city">📍 {hotel.city}</p>
                <p className="price">${hotel.price_per_night}<span>/night</span></p>
              </div>
              <div className="wishlist-actions">
                <button
                  className="btn-book-wishlist"
                  onClick={() => navigate("/hotels")}
                >
                  Book Now
                </button>
                <button
                  className="btn-remove-wishlist"
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