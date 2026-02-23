import { useState, useEffect } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";

function HotelList({ onSelectHotel }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://localhost:8000/hotels");
      setHotels(response.data.hotels);
      setLoading(false);
    } catch (err) {
      setError("Failed to load hotels");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="hotel-list">
      <h2>Available Hotels</h2>
      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onSelect={onSelectHotel}
          />
        ))}
      </div>
    </div>
  );
}

export default HotelList;