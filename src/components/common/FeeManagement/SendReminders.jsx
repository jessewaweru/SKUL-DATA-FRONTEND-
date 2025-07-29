import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const SendReminders = ({ onSend }) => {
  const [formData, setFormData] = useState({
    feeRecordIds: [],
    classId: "",
    term: "",
    year: "",
    status: "unpaid",
    sendVia: "both",
    message:
      "This is a reminder for unpaid fees. Please make payment before the due date to avoid penalties.",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.feeRecordIds.length &&
      !(formData.classId && formData.term && formData.year)
    ) {
      setError(
        "Either select specific records or filter by class, term and year"
      );
      return;
    }

    setError(null);
    onSend(formData);
  };

  return (
    <div className="send-reminders">
      <h3>Send Fee Reminders</h3>

      {error && <div className="fee-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="payment-form-group">
          <label>Filter by Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partially Paid</option>
            <option value="overdue">Overdue</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
            >
              <option value="">All Classes</option>
              {/* Options would be populated from API */}
            </select>
          </div>

          <div className="payment-form-group">
            <label>Term</label>
            <select name="term" value={formData.term} onChange={handleChange}>
              <option value="">All Terms</option>
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
            />
          </div>
        </div>

        <div className="payment-form-group">
          <label>Send Via</label>
          <select
            name="sendVia"
            value={formData.sendVia}
            onChange={handleChange}
          >
            <option value="email">Email Only</option>
            <option value="sms">SMS Only</option>
            <option value="both">Both Email and SMS</option>
          </select>
        </div>

        <div className="payment-form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="fee-form-actions">
          <button type="submit">Send Reminders</button>
        </div>
      </form>
    </div>
  );
};

export default SendReminders;
