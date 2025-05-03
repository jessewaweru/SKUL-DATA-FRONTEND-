import "../Parents/parents.css";

const ParentProfile = ({ parent }) => {
  if (!parent || !parent.user) {
    return <div>Loading parent profile...</div>;
  }
  return (
    <div className="parent-profile">
      <div className="profile-section">
        <div className="profile-header">
          <div className="avatar">
            {parent.user.first_name[0]}
            {parent.user.last_name[0]}
          </div>
          <h3>Contact Information</h3>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span>Email:</span>
            <span>{parent.user.email}</span>
          </div>
          <div className="detail-row">
            <span>Phone:</span>
            <span>{parent.phone_number || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span>Address:</span>
            <span>{parent.address || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span>Occupation:</span>
            <span>{parent.occupation || "Not provided"}</span>
          </div>
        </div>
      </div>

      <div className="preferences-section">
        <h3>Notification Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-item">
            <span>Email Notifications:</span>
            <span>
              {parent.receive_email_notifications ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="preference-item">
            <span>SMS Notifications:</span>
            <span>
              {parent.receive_sms_notifications ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="preference-item">
            <span>Preferred Language:</span>
            <span>{parent.preferred_language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
