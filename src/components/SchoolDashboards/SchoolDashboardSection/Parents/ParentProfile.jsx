import { useOutletContext } from "react-router-dom";
import "../Parents/parents.css";

const ParentProfile = () => {
  const { parent } = useOutletContext();

  console.log("ParentProfile - received parent:", parent);

  if (!parent) {
    return <div>Loading parent profile...</div>;
  }

  return (
    <div className="parent-profile">
      <div className="profile-section">
        <div className="profile-header">
          <div className="avatar">
            {parent.first_name?.[0] || ""}
            {parent.last_name?.[0] || ""}
          </div>
          <h3>Contact Information</h3>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {parent.first_name} {parent.last_name}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{parent.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">
              {parent.phone_number || "Not provided"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">
              {parent.address || "Not provided"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Occupation:</span>
            <span className="detail-value">
              {parent.occupation || "Not provided"}
            </span>
          </div>
        </div>
      </div>

      <div className="preferences-section">
        <h3>Notification Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-item">
            <span className="preference-label">Email Notifications:</span>
            <span
              className={`preference-value ${
                parent.receive_email_notifications ? "enabled" : "disabled"
              }`}
            >
              {parent.receive_email_notifications ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="preference-item">
            <span className="preference-label">Preferred Language:</span>
            <span className="preference-value">
              {parent.preferred_language?.toUpperCase() || "EN"}
            </span>
          </div>
        </div>
      </div>

      <div className="account-section">
        <h3>Account Information</h3>
        <div className="account-details">
          <div className="detail-row">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{parent.username}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${parent.status.toLowerCase()}`}>
              {parent.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Login:</span>
            <span className="detail-value">
              {parent.last_login
                ? new Date(parent.last_login).toLocaleString()
                : "Never"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">
              {new Date(parent.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
