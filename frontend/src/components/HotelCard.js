function HotelCard({ hotel, onSelect, isWishlisted, onWishlistToggle, user }) {
  const isAvailable = hotel.available === "yes";

  // Hotel images based on hotel name (you can replace with real images later)
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

  return (
    <div className={`hotel-card ${!isAvailable ? "unavailable" : ""}`}>
      <div className="card-header">
        <img
          src={getHotelImage(hotel.name)}
          alt={hotel.name}
          className="hotel-image"
        />
        {user && (
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(hotel.id);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )}
          </button>
        )}
        {!isAvailable && <span className="sold-out-badge">Sold Out</span>}
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3>{hotel.name}</h3>
          <div className="rating">
            <span className="star">★</span>
            <span>{hotel.rating}</span>
          </div>
        </div>

        <p className="city">
          <span className="icon">📍</span> {hotel.city}
        </p>

        <div className="card-tags">
          <span className="tag room-tag">{hotel.room_type}</span>
          <span className="tag guest-tag">👥 {hotel.capacity} guests</span>
        </div>

        <div className="card-footer">
          <div className="price-section">
            <span className="price">${hotel.price_per_night}</span>
            <span className="per-night">/ night</span>
          </div>

          <button
            onClick={() => onSelect(hotel)}
            disabled={!isAvailable}
            className={isAvailable ? "btn-book" : "btn-unavailable"}
          >
            {isAvailable ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;