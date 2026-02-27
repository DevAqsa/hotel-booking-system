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

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "Amazing experience! The booking was so easy and the hotel exceeded my expectations. Will definitely use StayEase again!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Toronto, Canada",
      text: "Best hotel booking platform I've used. Great prices and excellent customer service. Found perfect hotels for my business trips.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Emily Davis",
      location: "London, UK",
      text: "Found the perfect hotel for my vacation. The filters made it easy to find exactly what I wanted. Highly recommend!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const popularDestinations = [
    { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop", hotels: 234 },
    { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", hotels: 189 },
    { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop", hotels: 312 },
    { name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", hotels: 156 }
  ];

  const features = [
    { icon: "🔒", title: "Secure Booking", desc: "Your payments are protected with bank-level security" },
    { icon: "💰", title: "Best Price Guarantee", desc: "Find a lower price? We'll match it instantly" },
    { icon: "🎧", title: "24/7 Support", desc: "Round-the-clock assistance for all your needs" },
    { icon: "⚡", title: "Instant Confirmation", desc: "Get booking confirmation in seconds" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Your Perfect Stay</h1>
          <p>Book amazing hotels at the best prices. Over 500+ hotels worldwide.</p>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search hotels by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit">Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Hotels</span>
            </div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="featured-section">
        <div className="section-header-center">
          <h2>Featured Hotels</h2>
          <p>Hand-picked hotels for an unforgettable experience</p>
        </div>
        <div className="featured-grid">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="featured-card">
              <div className="featured-image-container">
                <img src={getHotelImage(hotel.name)} alt={hotel.name} />
                <div className="featured-badge">Featured</div>
              </div>
              <div className="featured-info">
                <div className="featured-title-row">
                  <h3>{hotel.name}</h3>
                  <div className="featured-rating">
                    <span>★</span> {hotel.rating}
                  </div>
                </div>
                <p className="featured-city">📍 {hotel.city}</p>
                <div className="featured-footer">
                  <div className="featured-price">
                    <span className="price-amount">${hotel.price_per_night}</span>
                    <span className="price-period">/night</span>
                  </div>
                  <button onClick={() => navigate("/hotels")} className="btn-view">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <button onClick={() => navigate("/hotels")} className="btn-see-all">
            View All Hotels →
          </button>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="destinations-section">
        <div className="section-header-center">
          <h2>Popular Destinations</h2>
          <p>Explore top destinations loved by travelers</p>
        </div>
        <div className="destinations-grid">
          {popularDestinations.map((dest, index) => (
            <div key={index} className="destination-card" onClick={() => navigate("/hotels")}>
              <img src={dest.image} alt={dest.name} />
              <div className="destination-overlay">
                <h3>{dest.name}</h3>
                <p>{dest.country}</p>
                <span className="hotel-count">{dest.hotels} hotels</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header-center">
          <h2>How It Works</h2>
          <p>Book your perfect stay in 3 easy steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">🔍</div>
            <h3>Search</h3>
            <p>Enter your destination and dates to find available hotels</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🏨</div>
            <h3>Choose</h3>
            <p>Compare prices, amenities and reviews to pick your ideal hotel</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>Book</h3>
            <p>Secure your reservation with instant confirmation</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header-center">
          <h2>What Our Guests Say</h2>
          <p>Real reviews from real travelers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.location}</p>
                </div>
              </div>
              <div className="testimonial-stars">
                {"★".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Perfect Stay?</h2>
          <p>Join thousands of happy travelers who book with StayEase</p>
          <div className="cta-buttons">
            <button onClick={() => navigate("/signup")} className="btn-cta-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate("/hotels")} className="btn-cta-secondary">
              Browse Hotels
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h4>🏨 StayEase</h4>
            <p>Your trusted partner for hotel bookings worldwide. Find the perfect stay for every trip.</p>
            <div className="footer-social">
              <a href="#">📘</a>
              <a href="#">🐦</a>
              <a href="#">📸</a>
              <a href="#">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/hotels">Browse Hotels</a>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
            <a href="#">About Us</a>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQs</a>
            <a href="#">Cancellation Policy</a>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 support@stayease.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Travel Street, NY</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 StayEase. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;