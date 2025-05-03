import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import Modal from "../../../common/Modal/Modal";
import { FiUpload, FiX } from "react-icons/fi";
import "../Classes/classes.css";

const DocumentUploadModal = ({ classId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "ASSIGNMENT",
    file: null,
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
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("document_type", formData.document_type);
      data.append("file", formData.file);
      data.append("school_class", classId);

      const response = await api.post("/class-documents/", data);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="document-upload-modal">
        <div className="modal-header">
          <h3>Upload Document</h3>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Document Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Document Type</label>
            <select
              value={formData.document_type}
              onChange={(e) =>
                setFormData({ ...formData, document_type: e.target.value })
              }
            >
              <option value="ASSIGNMENT">Assignment</option>
              <option value="NOTES">Teacher Notes</option>
              <option value="SYLLABUS">Syllabus</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              <FiUpload /> {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
