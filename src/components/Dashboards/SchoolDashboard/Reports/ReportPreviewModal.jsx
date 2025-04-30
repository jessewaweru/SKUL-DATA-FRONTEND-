// src/components/SchoolDashboard/Reports/ReportPreviewModal.jsx
import React from "react";
import { FiX, FiDownload } from "react-icons/fi";
import "../Reports/reports.css";

const ReportPreviewModal = ({ report, onClose, onDownload }) => {
  const getPreviewContent = () => {
    if (!report) return "<p>No preview available</p>";

    if (report.file_format === "PDF") {
      return `
        <div class="pdf-preview-container">
          <iframe 
            src="${report.file}" 
            width="100%" 
            height="500px" 
            style="border: none;"
            title="${report.title}"
          ></iframe>
        </div>
      `;
    } else {
      return `
        <div class="generic-preview">
          <h3>${report.title}</h3>
          <p>This report is in ${report.file_format} format. Download to view.</p>
        </div>
      `;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="report-preview-modal">
        <div className="modal-header">
          <h2>{report?.title || "Report Preview"}</h2>
          <div className="modal-actions">
            <button
              className="btn-icon"
              onClick={() =>
                onDownload(
                  report.id,
                  `${report.title}.${report.file_format.toLowerCase()}`
                )
              }
              title="Download"
            >
              <FiDownload />
            </button>
            <button className="btn-icon" onClick={onClose} title="Close">
              <FiX />
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
        </div>

        <div className="modal-footer">
          <div className="report-meta">
            <p>
              <strong>Generated:</strong>{" "}
              {new Date(report?.generated_at).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${report?.status.toLowerCase()}`}>
                {report?.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
