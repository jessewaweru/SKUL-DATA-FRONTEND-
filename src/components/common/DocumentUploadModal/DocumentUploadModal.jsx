// components/common/DocumentUploadModal.jsx
import { useState, useRef } from "react";
import { FiUpload, FiX, FiFile, FiTrash2 } from "react-icons/fi";

const DocumentUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  title = "Upload Document",
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (files.length === 0) return;
    onUpload(files);
    setFiles([]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="document-upload-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-button">
            <FiX />
          </button>
        </div>

        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            style={{ display: "none" }}
          />
          <FiUpload className="upload-icon" />
          <p>Drag and drop files here or click to browse</p>
          <p className="hint-text">
            Supports PDF, DOCX, XLSX, JPG, PNG (Max 10MB each)
          </p>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected Files ({files.length})</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <div className="file-info">
                    <FiFile className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="remove-button"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleUploadClick}
            className="upload-button"
            disabled={files.length === 0}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
