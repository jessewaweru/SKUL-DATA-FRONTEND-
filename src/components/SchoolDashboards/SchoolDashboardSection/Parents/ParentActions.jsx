import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiUserX, FiUserCheck, FiLink, FiMail, FiSave } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateParent,
  changeParentStatus,
} from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentActions = () => {
  const { parent } = useOutletContext(); // Use outlet context instead of useParent
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: parent?.phone_number || "",
    address: parent?.address || "",
    occupation: parent?.occupation || "",
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateParent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["parent", parent.id]);
      setIsEditing(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => changeParentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["parent", parent.id]);
      queryClient.invalidateQueries(["parents"]);
    },
  });

  const handleChangeStatus = async (newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to ${
          newStatus === "ACTIVE" ? "activate" : "deactivate"
        } this parent?`
      )
    ) {
      statusMutation.mutate({ id: parent.id, status: newStatus });
    }
  };

  const handleSave = async () => {
    updateMutation.mutate({
      id: parent.id,
      data: formData,
    });
  };

  const handleSendMessage = () => {
    // This would open a modal in a real implementation
    console.log("Open message modal");
  };

  if (!parent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="parent-actions">
      <div className="action-section">
        <h3>Parent Status</h3>
        <div className="status-actions">
          {parent.status === "ACTIVE" ? (
            <button
              className="danger"
              onClick={() => handleChangeStatus("INACTIVE")}
              disabled={statusMutation.isLoading}
            >
              <FiUserX /> Deactivate Parent
            </button>
          ) : (
            <button
              className="success"
              onClick={() => handleChangeStatus("ACTIVE")}
              disabled={statusMutation.isLoading}
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
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
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
              <button
                className="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    phone_number: parent.phone_number || "",
                    address: parent.address || "",
                    occupation: parent.occupation || "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="primary"
                onClick={handleSave}
                disabled={updateMutation.isLoading}
              >
                <FiSave />{" "}
                {updateMutation.isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">
                {parent.phone_number || "Not provided"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">
                {parent.address || "Not provided"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Occupation:</span>
              <span className="info-value">
                {parent.occupation || "Not provided"}
              </span>
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
          <button
            className="action-button"
            onClick={() => console.log("Manage children - to be implemented")}
          >
            <FiLink /> Manage Children
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentActions;
