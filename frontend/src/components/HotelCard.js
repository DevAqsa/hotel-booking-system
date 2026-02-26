function HotelCard({ hotel, onSelect, isWishlisted, onWishlistToggle, user }) {
  const isAvailable = hotel.available === "yes";

  return (
    <div className={`hotel-card ${!isAvailable ? "unavailable" : ""}`}>
      <div className="card-header">
        <div className="hotel-image">🏨</div>
        {user && (
          <button
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(hotel.id);
            }}
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div className="card-body">
        <h3>{hotel.name}</h3>
        <p className="city">📍 {hotel.city}</p>
        <p className="room-type">🛏️ {hotel.room_type}</p>
        <p className="capacity">👥 Up to {hotel.capacity} guests</p>

        <div className="card-footer">
          <div className="price-rating">
            <span className="price">${hotel.price_per_night}<small>/night</small></span>
            <span className="rating">⭐ {hotel.rating}</span>
          </div>

          <p className={`status ${isAvailable ? "available" : "booked"}`}>
            {isAvailable ? "✅ Available" : "❌ Booked"}
          </p>
        </div>

        <button
          onClick={() => onSelect(hotel)}
          disabled={!isAvailable}
        >
          {isAvailable ? "Book Now" : "Not Available"}
        </button>
      </div>
    </div>
  );
}

export default HotelCard;