function HotelCard({ hotel, onSelect }) {
  const isAvailable = hotel.available === "yes";

  return (
    <div className={`hotel-card ${!isAvailable ? "unavailable" : ""}`}>
      <h3>{hotel.name}</h3>
      <p>ID: {hotel.id}</p>
      <p className={`status ${isAvailable ? "available" : "booked"}`}>
        {isAvailable ? "✅ Available" : "❌ Booked"}
      </p>
      <button
        onClick={() => onSelect(hotel)}
        disabled={!isAvailable}
      >
        {isAvailable ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
}

export default HotelCard;