// src/components/SchoolDashboard/Reports/ShareReportModal.jsx
import React, { useState, useEffect } from "react";
import { FiX, FiCopy, FiMail, FiLink, FiCheck } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";

const ShareReportModal = ({ report, onClose }) => {
  const api = useApi();
  const [email, setEmail] = useState("");
  const [accessDuration, setAccessDuration] = useState("7");
  const [isCopied, setIsCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (report) {
      // Generate a base share link when modal opens
      setShareLink(`${window.location.origin}/shared-report/${report.id}`);
    }
  }, [report]);

  const generateShareLink = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/api/reports/share/", {
        report: report.id,
        expires_days: parseInt(accessDuration),
      });

      setShareLink(
        `${window.location.origin}/shared-report/${response.data.token}`
      );
    } catch (err) {
      setError("Failed to generate share link. Please try again.");
      console.error("Error generating share link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/api/reports/share/email/", {
        report: report.id,
        email,
        expires_days: parseInt(accessDuration),
      });

      // Reset form
      setEmail("");
      onClose();
    } catch (err) {
      setError("Failed to send email. Please try again.");
      console.error("Error sending share email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">
        <div className="modal-header">
          <h2>Share Report</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="share-method">
            <h3>
              <FiLink /> Share via Link
            </h3>

            <div className="form-group">
              <label>Access Duration</label>
              <select
                value={accessDuration}
                onChange={(e) => setAccessDuration(e.target.value)}
                disabled={isLoading}
              >
                <option value="1">1 Day</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="0">No Expiry</option>
              </select>
            </div>

            <button
              className="btn-secondary"
              onClick={generateShareLink}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Share Link"}
            </button>

            {shareLink && (
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                />
                <button
                  className="btn-icon"
                  onClick={handleCopyLink}
                  title="Copy to clipboard"
                >
                  {isCopied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            )}
          </div>

          <div className="share-method">
            <h3>
              <FiMail /> Share via Email
            </h3>

            <div className="form-group">
              <label>Recipient Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Access Duration</label>
              <select
                value={accessDuration}
                onChange={(e) => setAccessDuration(e.target.value)}
                disabled={isLoading}
              >
                <option value="1">1 Day</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="0">No Expiry</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={handleSendEmail}
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send Email"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
