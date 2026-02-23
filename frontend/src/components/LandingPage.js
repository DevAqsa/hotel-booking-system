import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const response = await axios.get("http://localhost:8000/hotels/featured");
      setFeaturedHotels(response.data.hotels);
    } catch (err) {
      console.error("Failed to load featured hotels");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/hotels?search=${searchQuery}`);
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "Amazing experience! The booking was so easy and the hotel exceeded my expectations.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      text: "Best hotel booking platform I've used. Great prices and excellent customer service.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Davis",
      text: "Found the perfect hotel for my vacation. Will definitely use again!",
      rating: 4
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Book amazing hotels at the best prices worldwide</p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search hotels by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="featured-section">
        <h2>Featured Hotels</h2>
        <div className="featured-grid">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="featured-card">
              <div className="featured-image">🏨</div>
              <h3>{hotel.name}</h3>
              <p className="hotel-city">📍 {hotel.city}</p>
              <p className="hotel-capacity">👥 Up to {hotel.capacity} guests</p>
              <span className={`status ${hotel.available === "yes" ? "available" : "booked"}`}>
                {hotel.available === "yes" ? "Available" : "Booked"}
              </span>
              <button
                onClick={() => navigate("/hotels")}
                className="btn-view"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Guests Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="stars">
                {"⭐".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-name">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🏨 HotelBook</h4>
            <p>Your trusted partner for hotel bookings worldwide.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/hotels">Browse Hotels</a>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQs</a>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">📘 Facebook</a>
              <a href="#">🐦 Twitter</a>
              <a href="#">📸 Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 HotelBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;