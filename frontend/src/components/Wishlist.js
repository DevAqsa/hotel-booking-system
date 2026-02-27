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

  const getHotelImage = (id, name) => {
    const images = {
      "134": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      "135": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
      "136": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
      "188": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "189": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
      "190": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
      "655": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      "656": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      "657": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "700": "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=400&h=300&fit=crop",
      "701": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
      "702": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop",
      "800": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop",
      "801": "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop",
      "802": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop"
    };

    if (images[id]) return images[id];

    const fallbackImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
    ];
    const index = parseInt(id) % fallbackImages.length;
    return fallbackImages[index];
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page-modern">
      {/* Header Section */}
      <div className="wishlist-header">
        <div className="wishlist-header-content">
          <div className="header-text">
            <h1>My Wishlist</h1>
            <p>Your saved hotels for future bookings</p>
          </div>
          <div className="wishlist-count">
            <span className="count-number">{wishlist.length}</span>
            <span className="count-label">Saved Hotels</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="wishlist-content">
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-illustration">
              <div className="heart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start exploring and save hotels you love!</p>
            <button onClick={() => navigate("/hotels")} className="btn-explore-hotels">
              <span>🔍</span> Explore Hotels
            </button>
          </div>
        ) : (
          <div className="wishlist-grid-modern">
            {wishlist.map((hotel) => (
              <div key={hotel.id} className="wishlist-card-modern">
                {/* Image Section */}
                <div className="wishlist-card-image">
                  <img src={getHotelImage(hotel.id, hotel.name)} alt={hotel.name} />
                  <div className="image-overlay">
                    <button
                      className="remove-wishlist-btn"
                      onClick={() => handleRemove(hotel.id)}
                      title="Remove from wishlist"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="rating-badge">
                    <span>★</span> {hotel.rating}
                  </div>
                </div>

                {/* Content Section */}
                <div className="wishlist-card-content">
                  <div className="card-header">
                    <h3>{hotel.name}</h3>
                    <p className="location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {hotel.city}
                    </p>
                  </div>

                  <div className="card-tags">
                    <span className="tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      {hotel.room_type}
                    </span>
                    <span className="tag">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      {hotel.capacity} Guests
                    </span>
                  </div>

                  <div className="card-footer">
                    <div className="price-info">
                      <span className="price">${hotel.price_per_night}</span>
                      <span className="per-night">/ night</span>
                    </div>
                    <button
                      className="btn-book-now"
                      onClick={() => navigate("/hotels")}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {wishlist.length > 0 && (
        <div className="wishlist-bottom-cta">
          <p>Want to discover more amazing hotels?</p>
          <button onClick={() => navigate("/hotels")} className="btn-browse-more">
            Browse All Hotels →
          </button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;