// src/components/SchoolDashboard/Reports/ScheduleEditorModal.jsx
import React, { useState } from "react";
import { FiX, FiSave, FiUsers } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";
import { useEffect } from "react";

const ScheduleEditorModal = ({ schedule, templates, onSave, onClose }) => {
  const api = useApi();
  const [formData, setFormData] = useState({
    name: "",
    report_template: "",
    frequency: "WEEKLY",
    custom_cron: "",
    parameters: {},
    recipients: [],
    email_recipients: "",
    is_active: true,
    ...schedule,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const frequencyOptions = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "TERMLY", label: "Termly" },
    { value: "YEARLY", label: "Yearly" },
    { value: "CUSTOM", label: "Custom Schedule" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/");
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRecipientToggle = (userId) => {
    setFormData((prev) => {
      const newRecipients = prev.recipients.includes(userId)
        ? prev.recipients.filter((id) => id !== userId)
        : [...prev.recipients, userId];
      return { ...prev, recipients: newRecipients };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let response;
      if (formData.id) {
        response = await api.put(
          `/api/reports/schedules/${formData.id}/`,
          formData
        );
      } else {
        response = await api.post("/api/reports/schedules/", formData);
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="schedule-editor-modal">
        <div className="modal-header">
          <h2>{schedule ? "Edit Schedule" : "Create New Schedule"}</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Schedule Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Report Template</label>
            <select
              name="report_template"
              value={formData.report_template}
              onChange={handleChange}
              required
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.template_type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {formData.frequency === "CUSTOM" && (
            <div className="form-group">
              <label>Cron Expression</label>
              <input
                type="text"
                name="custom_cron"
                value={formData.custom_cron}
                onChange={handleChange}
                placeholder="e.g. 0 8 * * 1 (Monday at 8:00 AM)"
                required
              />
              <small className="help-text">
                Use standard cron syntax.{" "}
                <a
                  href="https://crontab.guru/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cron expression helper
                </a>
              </small>
            </div>
          )}

          <div className="form-group">
            <label>Parameters (JSON)</label>
            <textarea
              name="parameters"
              value={JSON.stringify(formData.parameters, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData((prev) => ({ ...prev, parameters: parsed }));
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>
              <FiUsers /> Recipients (In-App)
            </label>
            <div className="recipients-grid">
              {availableUsers.map((user) => (
                <div key={user.id} className="recipient-item">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={formData.recipients.includes(user.id)}
                    onChange={() => handleRecipientToggle(user.id)}
                  />
                  <label htmlFor={`user-${user.id}`}>
                    {user.username} ({user.user_type})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Email Recipients</label>
            <textarea
              name="email_recipients"
              value={formData.email_recipients}
              onChange={handleChange}
              placeholder="Comma-separated email addresses"
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label htmlFor="is_active">Active Schedule</label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <FiSave /> {isSaving ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleEditorModal;
