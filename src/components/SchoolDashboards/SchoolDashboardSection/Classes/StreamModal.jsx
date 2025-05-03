// src/components/SchoolDashboard/Classes/StreamModal.jsx
import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import Modal from "../../../common/Modal/Modal";
import { FiX, FiSave } from "react-icons/fi";
import "../Classes/classes.css";

const StreamModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate
    if (!formData.name.trim()) {
      setError("Stream name is required");
      setLoading(false);
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="stream-modal">
        <div className="modal-header">
          <h2>{initialData ? "Edit Stream" : "Create New Stream"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="streamName">Stream Name*</label>
            <input
              id="streamName"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="e.g. East, West, Science"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="streamDescription">Description</label>
            <textarea
              id="streamDescription"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              <FiSave /> {loading ? "Saving..." : "Save Stream"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StreamModal;
