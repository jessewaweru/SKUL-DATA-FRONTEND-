import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const GenerateInvoices = ({ templates = [], classes = [] }) => {
  const api = useApi();
  const [formData, setFormData] = useState({
    templateId: "",
    classId: "",
    term: "",
    year: new Date().getFullYear().toString(),
    sendMethod: "email",
    includeMessage: true,
    message: "Please find attached the fee invoice for the upcoming term.",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Set default template on load
  useEffect(() => {
    const activeTemplate = templates.find((t) => t.is_active);
    if (activeTemplate && !formData.templateId) {
      setFormData((prev) => ({
        ...prev,
        templateId: activeTemplate.id,
      }));
    }
  }, [templates, formData.templateId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.templateId) {
      errors.templateId = "Please select a template";
    }
    if (!formData.classId) {
      errors.classId = "Please select a class";
    }
    if (!formData.term) {
      errors.term = "Please select a term";
    }
    if (!formData.year) {
      errors.year = "Please enter a year";
    } else if (!/^\d{4}$/.test(formData.year)) {
      errors.year = "Year must be in YYYY format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        template_id: parseInt(formData.templateId),
        school_class_id: parseInt(formData.classId),
        term: formData.term,
        year: formData.year,
        send_via: formData.sendMethod,
        message: formData.includeMessage ? formData.message : null,
      };

      console.log("Sending invoice generation request:", payload);

      await api.post("/api/fees/fee-reminders/send_reminders/", payload);

      setSuccess(true);
      setError(null);

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setFormData((prev) => ({
          ...prev,
          classId: "",
          term: "",
        }));
      }, 3000);
    } catch (err) {
      console.error("Error generating invoices:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate invoices"
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedClassName = () => {
    const selectedClass = classes.find((c) => c.id == formData.classId);
    return selectedClass ? selectedClass.name : "";
  };

  const getSelectedTemplateName = () => {
    const selectedTemplate = templates.find((t) => t.id == formData.templateId);
    return selectedTemplate ? selectedTemplate.name : "";
  };

  return (
    <div className="generate-invoices">
      <div className="generate-invoices-header">
        <h3>Generate Fee Invoices</h3>
        <p>
          Create and send fee invoices to parents for selected class and term
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <div className="success-content">
            <strong>Invoices Generated Successfully!</strong>
            <p>
              Fee invoices are being generated and sent in the background for{" "}
              {getSelectedClassName()} - {formData.term} {formData.year}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fee-error-message">
          <div className="error-icon">❌</div>
          <div className="error-content">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="generate-invoices-form">
        {/* Template Selection */}
        <div className="form-section">
          <h4>Invoice Template</h4>
          <div className="fee-form-row">
            <div className="payment-form-group">
              <label htmlFor="templateId">
                Template <span className="required">*</span>
              </label>
              <select
                id="templateId"
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                required
                className={validationErrors.templateId ? "error" : ""}
              >
                <option value="">Select Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.is_active && "(Active)"}
                  </option>
                ))}
              </select>
              {validationErrors.templateId && (
                <span className="validation-error">
                  {validationErrors.templateId}
                </span>
              )}
              {templates.length === 0 && (
                <span className="helper-text">
                  No templates available. Create a template first.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Class and Term Selection */}
        <div className="form-section">
          <h4>Target Class & Term</h4>
          <div className="fee-form-row">
            <div className="payment-form-group">
              <label htmlFor="classId">
                Class <span className="required">*</span>
              </label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className={validationErrors.classId ? "error" : ""}
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.student_count || 0} students)
                  </option>
                ))}
              </select>
              {validationErrors.classId && (
                <span className="validation-error">
                  {validationErrors.classId}
                </span>
              )}
              {classes.length === 0 && (
                <span className="helper-text">No classes available.</span>
              )}
            </div>

            <div className="payment-form-group">
              <label htmlFor="term">
                Term <span className="required">*</span>
              </label>
              <select
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                required
                className={validationErrors.term ? "error" : ""}
              >
                <option value="">Select Term</option>
                <option value="term_1">Term 1</option>
                <option value="term_2">Term 2</option>
                <option value="term_3">Term 3</option>
              </select>
              {validationErrors.term && (
                <span className="validation-error">
                  {validationErrors.term}
                </span>
              )}
            </div>
          </div>

          <div className="fee-form-row">
            <div className="payment-form-group">
              <label htmlFor="year">
                Year <span className="required">*</span>
              </label>
              <input
                id="year"
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="YYYY (e.g., 2025)"
                required
                className={validationErrors.year ? "error" : ""}
                maxLength="4"
              />
              {validationErrors.year && (
                <span className="validation-error">
                  {validationErrors.year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="form-section">
          <h4>Delivery Options</h4>
          <div className="payment-form-group">
            <label htmlFor="sendMethod">Send Via</label>
            <select
              id="sendMethod"
              name="sendMethod"
              value={formData.sendMethod}
              onChange={handleChange}
            >
              <option value="email">📧 Email Only</option>
              <option value="sms">📱 SMS Only</option>
              <option value="both">📧📱 Both Email & SMS</option>
            </select>
          </div>

          <div className="payment-form-group checkbox-group">
            <input
              type="checkbox"
              id="includeMessage"
              name="includeMessage"
              checked={formData.includeMessage}
              onChange={handleChange}
            />
            <label htmlFor="includeMessage">Include Custom Message</label>
          </div>

          {formData.includeMessage && (
            <div className="payment-form-group">
              <label htmlFor="message">Custom Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Enter a custom message to include with the invoices..."
              />
              <span className="helper-text">
                This message will be included in the email/SMS along with the
                invoice.
              </span>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {formData.templateId &&
          formData.classId &&
          formData.term &&
          formData.year && (
            <div className="form-section preview-section">
              <h4>Generation Preview</h4>
              <div className="preview-details">
                <div className="preview-item">
                  <span className="preview-label">Template:</span>
                  <span className="preview-value">
                    {getSelectedTemplateName()}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Class:</span>
                  <span className="preview-value">
                    {getSelectedClassName()}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Term:</span>
                  <span className="preview-value">
                    {formData.term
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                    {formData.year}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Delivery:</span>
                  <span className="preview-value">
                    {formData.sendMethod === "both"
                      ? "Email & SMS"
                      : formData.sendMethod.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Form Actions */}
        <div className="fee-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setFormData({
                templateId: "",
                classId: "",
                term: "",
                year: new Date().getFullYear().toString(),
                sendMethod: "email",
                includeMessage: true,
                message:
                  "Please find attached the fee invoice for the upcoming term.",
              })
            }
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={loading || templates.length === 0 || classes.length === 0}
          >
            {loading ? (
              <>
                <span className="loading-spinner small"></span>
                Generating Invoices...
              </>
            ) : (
              <>⚡ Generate & Send Invoices</>
            )}
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="help-section">
        <h4>💡 How it works</h4>
        <ul className="help-list">
          <li>Select an invoice template and target class</li>
          <li>Choose the term and year for which to generate invoices</li>
          <li>
            Select how you want to deliver the invoices (email, SMS, or both)
          </li>
          <li>
            Invoices will be generated for all students in the selected class
          </li>
          <li>
            Parents will receive the invoices via their preferred contact method
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GenerateInvoices;
