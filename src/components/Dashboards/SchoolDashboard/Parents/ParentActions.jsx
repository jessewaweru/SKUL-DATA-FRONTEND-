import { useState } from "react";
import { FiUserX, FiUserCheck, FiLink, FiMail, FiSave } from "react-icons/fi";
import { useParent } from "../../../../context/ParentContext";
import "../Parents/parents.css";

const ParentActions = () => {
  const { parent, updateParent } = useParent();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: parent.phone_number,
    address: parent.address,
    occupation: parent.occupation,
  });
  const [selectedChildren, setSelectedChildren] = useState(
    parent.children.map((c) => c.id)
  );

  const handleChangeStatus = async (newStatus) => {
    await updateParent(parent.id, { status: newStatus });
  };

  const handleSave = async () => {
    await updateParent(parent.id, {
      phone_number: formData.phone,
      address: formData.address,
      occupation: formData.occupation,
    });
    setIsEditing(false);
  };

  const handleSendMessage = () => {
    // This would open a modal in a real implementation
    console.log("Open message modal");
  };

  return (
    <div className="parent-actions">
      <div className="action-section">
        <h3>Parent Status</h3>
        <div className="status-actions">
          {parent.status === "ACTIVE" ? (
            <button
              className="danger"
              onClick={() => handleChangeStatus("INACTIVE")}
            >
              <FiUserX /> Deactivate Parent
            </button>
          ) : (
            <button
              className="success"
              onClick={() => handleChangeStatus("ACTIVE")}
            >
              <FiUserCheck /> Activate Parent
            </button>
          )}
        </div>
      </div>

      <div className="action-section">
        <h3>Contact Information</h3>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button className="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="primary" onClick={handleSave}>
                <FiSave /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="info-row">
              <span>Phone:</span>
              <span>{parent.phone_number || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span>Address:</span>
              <span>{parent.address || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span>Occupation:</span>
              <span>{parent.occupation || "Not provided"}</span>
            </div>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit Information
            </button>
          </div>
        )}
      </div>

      <div className="action-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="action-button" onClick={handleSendMessage}>
            <FiMail /> Send Message
          </button>
          <button className="action-button">
            <FiLink /> Manage Children
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentActions;
