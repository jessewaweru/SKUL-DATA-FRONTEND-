// src/components/SchoolDashboard/Reports/ReportPreviewModal.jsx - Fixed version
import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiExternalLink } from "react-icons/fi";
import "../Reports/reports.css";

const ReportPreviewModal = ({ report, onClose, onDownload }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [report]);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload(report, e);
  };

  const handleOpenInNewTab = () => {
    if (report?.file) {
      window.open(report.file, "_blank");
    }
  };

  const getPreviewContent = () => {
    if (!report || !report.file) {
      return `
        <div class="preview-error">
          <p>⚠️ Report file not available</p>
        </div>
      `;
    }

    if (report.file_format === "PDF") {
      return `
        <div class="pdf-preview-container">
          <div class="pdf-preview-info">
            <div class="file-icon" style="font-size: 4rem; text-align: center; margin: 20px 0;">📄</div>
            <h3 style="text-align: center; margin: 10px 0;">${report.title}</h3>
            <p style="text-align: center; color: #6b7280; margin: 10px 0;">
              PDF report ready to view
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <button 
                onclick="window.open('${report.file}', '_blank')" 
                style="padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;"
                onmouseover="this.style.background='#4f46e5'"
                onmouseout="this.style.background='#6366f1'"
              >
                📖 Open PDF in New Tab
              </button>
            </div>
            <p style="text-align: center; color: #9ca3af; font-size: 0.875rem; margin-top: 20px;">
              Click the button above to view the full report in a new tab
            </p>
          </div>
        </div>
      `;
    } else if (report.file_format === "EXCEL" || report.file_format === "CSV") {
      return `
        <div class="file-preview">
          <div class="file-icon">📊</div>
          <h3>${report.title}</h3>
          <p>This report is in ${report.file_format} format.</p>
          <p>Click the download button to view the full report.</p>
          <div style="margin-top: 20px;">
            <a href="${report.file}" download class="btn-primary" style="text-decoration: none; padding: 10px 20px; display: inline-block;">
              Download ${report.file_format}
            </a>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="generic-preview">
          <div class="file-icon">📄</div>
          <h3>${report.title}</h3>
          <p>Format: ${report.file_format}</p>
          <p>Download to view this report.</p>
        </div>
      `;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="report-preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{report?.title || "Report Preview"}</h2>
          <div className="modal-actions">
            {report?.file && (
              <button
                className="btn-icon btn-primary"
                onClick={handleOpenInNewTab}
                title="Open in new tab"
                style={{
                  background: "#6366f1",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FiExternalLink /> Open PDF
              </button>
            )}
            <button
              className="btn-icon"
              onClick={handleDownloadClick}
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
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading preview...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn-primary" onClick={handleDownloadClick}>
                Download Report
              </button>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          )}
        </div>

        <div className="modal-footer">
          <div className="report-meta">
            <p>
              <strong>Generated:</strong>{" "}
              {report?.generated_at
                ? new Date(report.generated_at).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Format:</strong> {report?.file_format || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${
                  report?.status?.toLowerCase() || ""
                }`}
              >
                {report?.status || "Unknown"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
