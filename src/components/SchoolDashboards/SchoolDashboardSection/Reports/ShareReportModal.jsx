// src/components/SchoolDashboard/Reports/ShareReportModal.jsx
import React, { useState, useEffect } from "react";
import { FiX, FiSend, FiMail, FiUsers, FiCalendar } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";

const ShareReportModal = ({ report, onClose }) => {
  const api = useApi();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState("");
  const [expiryDays, setExpiryDays] = useState(30);
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareMethod, setShareMethod] = useState("users"); // 'users' or 'email'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/");
        const usersData = response.data?.results || response.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [api]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0 && !emailAddresses.trim()) {
      alert("Please select at least one user or enter email addresses");
      return;
    }

    setIsSharing(true);

    try {
      const shareData = {
        report_id: report.id,
        user_ids: selectedUsers,
        emails: emailAddresses
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e),
        expiry_days: expiryDays,
        message: message,
      };

      await api.post(`/reports/generated/${report.id}/share/`, shareData);

      alert("Report shared successfully!");
      onClose();
    } catch (error) {
      console.error("Error sharing report:", error);
      alert("Failed to share report. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Report: {report.title}</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="share-method-tabs">
            <button
              className={`tab-button ${
                shareMethod === "users" ? "active" : ""
              }`}
              onClick={() => setShareMethod("users")}
            >
              <FiUsers /> Share with Users
            </button>
            <button
              className={`tab-button ${
                shareMethod === "email" ? "active" : ""
              }`}
              onClick={() => setShareMethod("email")}
            >
              <FiMail /> Share via Email
            </button>
          </div>

          {shareMethod === "users" ? (
            <div className="share-section">
              <div className="section-header">
                <FiUsers />
                <h3>Select Users</h3>
                <span className="badge">{selectedUsers.length} selected</span>
              </div>

              <div className="users-list">
                {users.length === 0 ? (
                  <p className="empty-message">No users available</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="user-item">
                      <input
                        type="checkbox"
                        id={`share-user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                      />
                      <label htmlFor={`share-user-${user.id}`}>
                        <div className="user-info">
                          <div className="user-name">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="user-details">
                            {user.email} • {user.user_type}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="share-section">
              <div className="section-header">
                <FiMail />
                <h3>Email Addresses</h3>
              </div>

              <textarea
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
                placeholder="Enter email addresses separated by commas&#10;e.g., parent1@example.com, parent2@example.com"
                rows="5"
                className="email-input"
              />
              <p className="help-text">
                Separate multiple email addresses with commas
              </p>
            </div>
          )}

          <div className="share-options">
            <div className="form-group">
              <label>
                <FiCalendar /> Access Duration (Days)
              </label>
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                min="1"
                max="365"
                className="expiry-input"
              />
              <p className="help-text">
                Recipients will have access for {expiryDays} days
              </p>
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to include with the report..."
                rows="3"
                className="message-input"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleShare}
            disabled={isSharing}
          >
            <FiSend /> {isSharing ? "Sharing..." : "Share Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
