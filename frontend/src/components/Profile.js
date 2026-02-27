import { useState } from "react";
import axios from "axios";

function Profile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.put(
        `http://localhost:8000/profile/${user.username}`,
        formData
      );

      if (response.data.success) {
        onUpdateUser(response.data.user);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "New passwords don't match" });
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.put(
        "http://localhost:8000/profile/password/update",
        {
          username: user.username,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page-modern">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span>{getInitials(user?.name || "U")}</span>
            </div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="username">@{user?.username}</p>
              <div className="member-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Member since 2025
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="profile-container">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => { setActiveTab("profile"); setMessage(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Personal Info</span>
              </button>
              <button
                className={`nav-item ${activeTab === "password" ? "active" : ""}`}
                onClick={() => { setActiveTab("password"); setMessage(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>Security</span>
              </button>
              <button className="nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <span>Notifications</span>
              </button>
              <button className="nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                <span>Preferences</span>
              </button>
            </nav>

            <div className="sidebar-help">
              <div className="help-card">
                <div className="help-icon">💡</div>
                <h4>Need Help?</h4>
                <p>Contact our support team for assistance</p>
                <button className="btn-help">Get Support</button>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="profile-form-section">
            {message && (
              <div className={`profile-message ${message.type}`}>
                <span className="message-icon">
                  {message.type === "success" ? "✓" : "✕"}
                </span>
                {message.text}
              </div>
            )}

            {activeTab === "profile" ? (
              <div className="form-card">
                <div className="form-card-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal details here</p>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Username</span>
                      <span className="label-hint">Cannot be changed</span>
                    </label>
                    <div className="input-with-icon disabled">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input type="text" value={user?.username || ""} disabled />
                      <span className="lock-icon">🔒</span>
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Full Name</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Email Address</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Phone Number</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel">Cancel</button>
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-small"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="form-card">
                <div className="form-card-header">
                  <h2>Change Password</h2>
                  <p>Ensure your account is using a secure password</p>
                </div>

                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Current Password</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">New Password</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    <span className="input-hint">Must be at least 6 characters</span>
                  </div>

                  <div className="form-group-modern">
                    <label>
                      <span className="label-text">Confirm New Password</span>
                    </label>
                    <div className="input-with-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      <li className={passwordData.new_password.length >= 6 ? "met" : ""}>
                        <span className="check">✓</span> At least 6 characters
                      </li>
                      <li className={passwordData.new_password === passwordData.confirm_password && passwordData.new_password ? "met" : ""}>
                        <span className="check">✓</span> Passwords match
                      </li>
                    </ul>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setPasswordData({ current_password: "", new_password: "", confirm_password: "" })}>
                      Clear
                    </button>
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-small"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;