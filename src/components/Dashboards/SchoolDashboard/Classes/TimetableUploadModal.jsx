import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import Modal from "../../../common/Modal/Modal";
import { FiUpload, FiX } from "react-icons/fi";
import "../Classes/classes.css";

const TimetableUploadModal = ({ classId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    file: null,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("description", formData.description);
      data.append("file", formData.file);
      data.append("is_active", formData.is_active);
      data.append("school_class", classId);

      const response = await api.post("/class-timetables/", data);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="timetable-upload-modal">
        <div className="modal-header">
          <h3>Upload Timetable</h3>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.doc,.docx"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            <label htmlFor="is_active">Set as active timetable</label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              <FiUpload /> {loading ? "Uploading..." : "Upload Timetable"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TimetableUploadModal;
