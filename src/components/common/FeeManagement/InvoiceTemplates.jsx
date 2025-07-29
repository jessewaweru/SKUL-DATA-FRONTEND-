import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const InvoiceTemplates = ({ templates = [], onSetDefault }) => {
  // Ensure templates is always an array
  const safeTemplates = Array.isArray(templates) ? templates : [];
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handlePreview = (template) => {
    if (template) {
      setPreviewTemplate(template);
    }
  };

  if (safeTemplates.length === 0) {
    return (
      <div className="invoice-templates">
        <p>No templates available</p>
      </div>
    );
  }

  return (
    <div className="invoice-templates">
      <div className="templates-list">
        <h3>Available Templates</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeTemplates.map((template) => (
              <tr key={template?.id || Math.random()}>
                <td>{template?.name || "Unnamed Template"}</td>
                <td>
                  {template?.is_active ? (
                    <span className="fee-status-badge status-active">
                      Active
                    </span>
                  ) : (
                    <span className="fee-status-badge status-inactive">
                      Inactive
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handlePreview(template)}
                    className="action-button"
                  >
                    Preview
                  </button>
                  {!template?.is_active && (
                    <button
                      onClick={() => template?.id && onSetDefault(template.id)}
                      className="action-button primary"
                    >
                      Set Default
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewTemplate && (
        <div className="template-preview">
          <h3>Template Preview: {previewTemplate?.name || "Preview"}</h3>
          <div className="preview-content">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  previewTemplate?.header_html || "<p>No header content</p>",
              }}
            />
            <div className="sample-content">
              <h4>Sample Invoice Content</h4>
              <p>Parent: John Doe</p>
              <p>Student: Jane Doe (SCH-2023-001)</p>
              <p>Class: Grade 4</p>
              <p>Term: Term 1 2023</p>
              <p>Amount Due: KES 15,000</p>
              <p>Balance: KES 5,000</p>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  previewTemplate?.footer_html || "<p>No footer content</p>",
              }}
            />
          </div>
          <button
            onClick={() => setPreviewTemplate(null)}
            className="close-preview"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplates;
