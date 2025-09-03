import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const InvoiceTemplates = ({ templates = [], onSetDefault }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ensure templates is always an array
  const safeTemplates = Array.isArray(templates) ? templates : [];

  const handlePreview = (template) => {
    if (template) {
      setPreviewTemplate(template);
    }
  };

  const handleSetDefault = async (templateId) => {
    try {
      setLoading(true);
      await onSetDefault(templateId);
    } catch (error) {
      console.error("Error setting default template:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (safeTemplates.length === 0) {
    return (
      <div className="invoice-templates">
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Invoice Templates</h3>
          <p>
            No invoice templates have been created yet. Create your first
            template to get started.
          </p>
          <button className="create-template-btn">Create Template</button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-templates">
      <div className="templates-section">
        <div className="section-header">
          <h3>Available Invoice Templates</h3>
          <div className="templates-count">
            {safeTemplates.length} template
            {safeTemplates.length !== 1 ? "s" : ""} available
          </div>
        </div>

        <div className="templates-grid">
          {safeTemplates.map((template) => (
            <div key={template?.id || Math.random()} className="template-card">
              <div className="template-card-header">
                <h4 className="template-name">
                  {template?.name || "Unnamed Template"}
                </h4>
                <div className="template-status">
                  {template?.is_active ? (
                    <span className="fee-status-badge status-active">
                      ✓ Active
                    </span>
                  ) : (
                    <span className="fee-status-badge status-inactive">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="template-card-body">
                <div className="template-meta">
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">
                      {formatDate(template?.created_at)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Updated:</span>
                    <span className="meta-value">
                      {formatDate(template?.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="template-preview-snippet">
                  <div className="snippet-label">Header Preview:</div>
                  <div
                    className="snippet-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        template?.header_html?.substring(0, 100) + "..." ||
                        "No header content",
                    }}
                  />
                </div>
              </div>

              <div className="template-card-actions">
                <button
                  onClick={() => handlePreview(template)}
                  className="action-button preview-btn"
                >
                  👁️ Preview
                </button>
                {!template?.is_active && (
                  <button
                    onClick={() =>
                      template?.id && handleSetDefault(template.id)
                    }
                    className="action-button primary set-default-btn"
                    disabled={loading}
                  >
                    {loading ? "Setting..." : "Set Default"}
                  </button>
                )}
                <button className="action-button edit-btn">✏️ Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="template-preview-modal">
          <div
            className="modal-overlay"
            onClick={() => setPreviewTemplate(null)}
          />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Template Preview: {previewTemplate?.name || "Preview"}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="preview-content">
                {/* Header Section */}
                <div className="preview-section">
                  <h4 className="section-title">Header</h4>
                  <div
                    className="preview-html"
                    dangerouslySetInnerHTML={{
                      __html:
                        previewTemplate?.header_html ||
                        "<p>No header content</p>",
                    }}
                  />
                </div>

                {/* Sample Invoice Content */}
                <div className="preview-section">
                  <h4 className="section-title">Sample Invoice Content</h4>
                  <div className="sample-invoice-content">
                    <table className="sample-invoice-table">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Invoice Date:</strong>
                          </td>
                          <td>{new Date().toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Parent:</strong>
                          </td>
                          <td>John Doe</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Student:</strong>
                          </td>
                          <td>Jane Doe (MMS001-2024-001)</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Class:</strong>
                          </td>
                          <td>Grade 4A</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Term:</strong>
                          </td>
                          <td>Term 1 2025</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Amount Due:</strong>
                          </td>
                          <td>KES 25,000.00</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Amount Paid:</strong>
                          </td>
                          <td>KES 10,000.00</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Balance:</strong>
                          </td>
                          <td className="balance-amount">KES 15,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="preview-section">
                  <h4 className="section-title">Footer</h4>
                  <div
                    className="preview-html"
                    dangerouslySetInnerHTML={{
                      __html:
                        previewTemplate?.footer_html ||
                        "<p>No footer content</p>",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="modal-close-button"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplates;
