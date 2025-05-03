import React from "react";
import { FiX, FiDownload, FiShare2 } from "react-icons/fi";
import "../Documents/documents.css";

const DocumentPreviewModal = ({ document, onClose }) => {
  const renderPreview = () => {
    if (document.file_type.includes("pdf")) {
      return (
        <iframe
          src={document.file_url}
          title={document.title}
          className="pdf-preview"
        />
      );
    } else if (document.file_type.includes("image")) {
      return <img src={document.file_url} alt={document.title} />;
    } else {
      return (
        <div className="unsupported-preview">
          <p>Preview not available for this file type</p>
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FiDownload /> Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h3>{document.title}</h3>
          <div className="preview-actions">
            <button className="icon-button">
              <FiShare2 /> Share
            </button>
            <a href={document.file_url} download className="icon-button">
              <FiDownload /> Download
            </a>
            <button className="icon-button" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>
        <div className="preview-content">{renderPreview()}</div>
        <div className="preview-meta">
          <div>
            <strong>Category:</strong> {document.category?.name || "-"}
          </div>
          <div>
            <strong>Uploaded by:</strong> {document.uploaded_by_name}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(document.uploaded_at).toLocaleString()}
          </div>
          {document.related_class && (
            <div>
              <strong>Class:</strong> {document.related_class.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
