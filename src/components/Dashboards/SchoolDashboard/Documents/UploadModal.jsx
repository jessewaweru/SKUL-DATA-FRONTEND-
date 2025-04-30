import React, { useState, useCallback } from "react";
import { FiUpload, FiX, FiFile, FiAlertCircle } from "react-icons/fi";
import Dropzone from "react-dropzone";
import { useApi } from "../../../../hooks/useApi";
import "../Documents/documents.css";

const UploadModal = ({
  onClose,
  onUploadSuccess,
  categories,
  classes,
  currentUser,
}) => {
  const [files, setFiles] = useState([]);
  const api = useApi();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    related_class: "",
    is_public: false,
    uploadType: "files", // 'files' or 'zip'
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (formData.uploadType === "zip" && acceptedFiles.length > 1) {
        setError("Please upload only one ZIP file");
        return;
      }

      setFiles((prev) => [...prev, ...acceptedFiles]);
      setError(null);
    },
    [formData.uploadType]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();

      if (formData.uploadType === "zip") {
        data.append("zip", files[0]);
      } else {
        files.forEach((file) => data.append("files", file));
      }

      data.append("category", formData.category);
      data.append("is_public", formData.is_public);

      if (formData.related_class) {
        data.append("related_class", formData.related_class);
      }

      // Add school if user is superuser
      if (currentUser.user_type === "school_superuser") {
        data.append("school", currentUser.superuser_profile.school);
      }

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      await api.post("/documents/bulk_upload/", data, config);

      onUploadSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h3>Upload Documents</h3>
          <button onClick={onClose} className="close-button">
            <FiX />
          </button>
        </div>

        <div className="upload-options">
          <label>
            <input
              type="radio"
              name="uploadType"
              value="files"
              checked={formData.uploadType === "files"}
              onChange={() => setFormData({ ...formData, uploadType: "files" })}
            />
            Multiple Files
          </label>
          <label>
            <input
              type="radio"
              name="uploadType"
              value="zip"
              checked={formData.uploadType === "zip"}
              onChange={() => setFormData({ ...formData, uploadType: "zip" })}
            />
            ZIP Archive
          </label>
        </div>

        <Dropzone
          onDrop={handleDrop}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.csv,.zip"
          maxSize={10 * 1024 * 1024} // 10MB
          disabled={isUploading}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={`dropzone ${files.length > 0 ? "has-files" : ""}`}
            >
              <input {...getInputProps()} />
              <FiUpload size={24} />
              <p>Drag & drop files here, or click to select</p>
              <small>
                Supports: PDF, Word, Excel, Images, CSV (Max 10MB each)
              </small>
            </div>
          )}
        </Dropzone>

        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected Files ({files.length})</h4>
            <ul>
              {files.map((file, index) => (
                <li key={file.name}>
                  <FiFile />
                  <span>{file.name}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              disabled={isUploading}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {classes.length > 0 && (
            <div className="form-group">
              <label>Related Class (Optional)</label>
              <select
                value={formData.related_class}
                onChange={(e) =>
                  setFormData({ ...formData, related_class: e.target.value })
                }
                disabled={isUploading}
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
              disabled={isUploading}
            />
            <label htmlFor="is_public">Make these documents public</label>
          </div>

          {error && (
            <div className="error-message">
              <FiAlertCircle /> {error}
            </div>
          )}

          {isUploading && (
            <div className="upload-progress">
              <progress value={uploadProgress} max="100" />
              <span>{uploadProgress}%</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload Documents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
