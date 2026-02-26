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

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-tabs">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile Info
        </button>
        <button
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {activeTab === "profile" ? (
        <form className="profile-form" onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={user?.username || ""} disabled />
            <small>Username cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Enter your phone number"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <form className="profile-form" onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;