import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const GenerateInvoices = ({ templates }) => {
  const api = useApi();
  const [formData, setFormData] = useState({
    templateId: "",
    classId: "",
    term: "",
    year: "",
    sendMethod: "email",
    includeMessage: true,
    message: "Please find attached the fee invoice for the upcoming term.",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.templateId ||
      !formData.classId ||
      !formData.term ||
      !formData.year
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/fee_management/generate-fee-invoices", {
        template_id: formData.templateId,
        school_class_id: formData.classId,
        term: formData.term,
        year: formData.year,
        send_via: formData.sendMethod,
        message: formData.includeMessage ? formData.message : null,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to generate invoices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-invoices">
      <h3>Generate Fee Invoices</h3>

      {success && (
        <div className="success-message">
          Invoices are being generated and sent in the background.
        </div>
      )}

      {error && <div className="fee-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Template</label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              required
            >
              <option value="">Select Template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} {template.is_active && "(Active)"}
                </option>
              ))}
            </select>
          </div>

          <div className="payment-form-group">
            <label>Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {/* Options would be populated from API */}
            </select>
          </div>
        </div>

        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Term</label>
            <select
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
            >
              <option value="">Select Term</option>
              <option value="term_1">Term 1</option>
              <option value="term_2">Term 2</option>
              <option value="term_3">Term 3</option>
            </select>
          </div>

          <div className="payment-form-group">
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="YYYY"
              required
            />
          </div>
        </div>

        <div className="payment-form-group">
          <label>Send Via</label>
          <select
            name="sendMethod"
            value={formData.sendMethod}
            onChange={handleChange}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
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
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
            />
          </div>
        )}

        <div className="fee-form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Invoices"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateInvoices;
