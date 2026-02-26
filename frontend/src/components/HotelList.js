import { useState, useEffect } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";

function HotelList({ user, onSelectHotel }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchHotels();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchHotels = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.available_only) params.append("available_only", "true");
      if (filters.sort_by) params.append("sort_by", filters.sort_by);

      const response = await axios.get(`http://localhost:8000/hotels?${params}`);
      setHotels(response.data.hotels);
      setLoading(false);
    } catch (err) {
      setError("Failed to load hotels");
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/wishlist/${user.username}`);
      setWishlistIds(response.data.hotel_ids);
    } catch (err) {
      console.error("Failed to load wishlist");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels({
      search,
      min_price: minPrice,
      max_price: maxPrice,
      available_only: availableOnly,
      sort_by: sortBy
    });
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
    setSortBy("");
    fetchHotels();
  };

  const handleWishlistToggle = async (hotelId) => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }

    try {
      if (wishlistIds.includes(hotelId)) {
        await axios.post("http://localhost:8000/wishlist/remove", {
          username: user.username,
          hotel_id: hotelId
        });
        setWishlistIds(wishlistIds.filter(id => id !== hotelId));
      } else {
        await axios.post("http://localhost:8000/wishlist/add", {
          username: user.username,
          hotel_id: hotelId
        });
        setWishlistIds([...wishlistIds, hotelId]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="hotel-list">
      <h2>Browse Hotels</h2>

      {/* Search & Filter Bar */}
      <form className="filter-bar" onSubmit={handleSearch}>
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Available Only
          </label>

          <button type="submit" className="btn-search">Search</button>
          <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {loading ? (
        <p className="loading">Loading hotels...</p>
      ) : (
        <>
          <p className="results-count">{hotels.length} hotels found</p>
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onSelect={onSelectHotel}
                isWishlisted={wishlistIds.includes(hotel.id)}
                onWishlistToggle={handleWishlistToggle}
                user={user}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HotelList;