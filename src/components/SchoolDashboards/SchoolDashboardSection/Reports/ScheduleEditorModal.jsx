// src/components/SchoolDashboard/Reports/ScheduleEditorModal.jsx - Fixed version
import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiUsers, FiInfo } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";

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
  });

  const [isSaving, setIsSaving] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showRecipients, setShowRecipients] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const frequencyOptions = [
    { value: "DAILY", label: "Daily", description: "Runs every day" },
    { value: "WEEKLY", label: "Weekly", description: "Runs once per week" },
    { value: "MONTHLY", label: "Monthly", description: "Runs once per month" },
    { value: "TERMLY", label: "Termly", description: "Runs at end of term" },
    { value: "YEARLY", label: "Yearly", description: "Runs once per year" },
    {
      value: "CUSTOM",
      label: "Custom Schedule",
      description: "Use cron expression",
    },
  ];

  // Initialize form data when schedule prop changes
  useEffect(() => {
    if (schedule) {
      setFormData({
        ...schedule,
        report_template:
          schedule.report_template?.id || schedule.report_template || "",
        parameters: schedule.parameters || {},
        recipients: schedule.recipients || [],
        email_recipients: schedule.email_recipients || "",
      });

      // Find and set the selected template
      if (schedule.report_template) {
        const template = templates.find(
          (t) =>
            t.id === (schedule.report_template?.id || schedule.report_template)
        );
        setSelectedTemplate(template);
      }
    }
  }, [schedule, templates]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/");
        const usersData = response.data?.results || response.data || [];
        setAvailableUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAvailableUsers([]);
      }
    };
    fetchUsers();
  }, [api]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "report_template") {
      const template = templates.find((t) => t.id === parseInt(value));
      setSelectedTemplate(template);

      // Auto-populate parameters based on template type
      let defaultParams = {};
      if (template?.template_type === "ACADEMIC") {
        defaultParams = {
          include_rankings: true,
          include_comments: true,
          include_graphs: false,
        };
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        parameters: { ...prev.parameters, ...defaultParams },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleParameterChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value,
      },
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
      // Prepare data for submission
      const submitData = {
        ...formData,
        report_template: parseInt(formData.report_template),
        parameters: JSON.stringify(formData.parameters),
      };

      let response;
      if (schedule?.id) {
        response = await api.put(
          `/reports/schedules/${schedule.id}/`,
          submitData
        );
      } else {
        response = await api.post("/reports/schedules/", submitData);
      }

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule. Please check the form and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderParametersEditor = () => {
    if (!selectedTemplate) return null;

    if (selectedTemplate.template_type === "ACADEMIC") {
      return (
        <div className="parameters-section">
          <h4>Report Parameters</h4>
          <div className="parameters-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.parameters?.include_rankings || false}
                onChange={(e) =>
                  handleParameterChange("include_rankings", e.target.checked)
                }
              />
              <span>Include Student Rankings</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.parameters?.include_comments || false}
                onChange={(e) =>
                  handleParameterChange("include_comments", e.target.checked)
                }
              />
              <span>Include Teacher Comments</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.parameters?.include_graphs || false}
                onChange={(e) =>
                  handleParameterChange("include_graphs", e.target.checked)
                }
              />
              <span>Include Performance Graphs</span>
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="parameters-section">
        <h4>Report Parameters (JSON)</h4>
        <textarea
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
          className="json-editor"
        />
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="schedule-editor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{schedule ? "Edit Schedule" : "Create New Schedule"}</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Schedule Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., End of Term Reports"
              required
            />
          </div>

          <div className="form-group">
            <label>Report Template *</label>
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
            {selectedTemplate && (
              <small className="help-text">
                <FiInfo />{" "}
                {selectedTemplate.description ||
                  `${selectedTemplate.template_type} report template`}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Frequency *</label>
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
            <small className="help-text">
              {
                frequencyOptions.find((o) => o.value === formData.frequency)
                  ?.description
              }
            </small>
          </div>

          {formData.frequency === "CUSTOM" && (
            <div className="form-group">
              <label>Cron Expression *</label>
              <input
                type="text"
                name="custom_cron"
                value={formData.custom_cron}
                onChange={handleChange}
                placeholder="0 8 * * 1 (Monday at 8:00 AM)"
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

          {renderParametersEditor()}

          <div className="form-group">
            <label>
              <FiUsers /> In-App Recipients
              <button
                type="button"
                className="btn-text"
                onClick={() => setShowRecipients(!showRecipients)}
              >
                {showRecipients ? "Hide" : "Show"} ({formData.recipients.length}{" "}
                selected)
              </button>
            </label>

            {showRecipients && (
              <div className="recipients-grid">
                {availableUsers.length === 0 ? (
                  <p>No users available</p>
                ) : (
                  availableUsers.map((user) => (
                    <div key={user.id} className="recipient-item">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={formData.recipients.includes(user.id)}
                        onChange={() => handleRecipientToggle(user.id)}
                      />
                      <label htmlFor={`user-${user.id}`}>
                        {user.first_name} {user.last_name} ({user.user_type})
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Email Recipients</label>
            <textarea
              name="email_recipients"
              value={formData.email_recipients}
              onChange={handleChange}
              placeholder="email1@example.com, email2@example.com"
              rows="2"
            />
            <small className="help-text">
              Comma-separated email addresses for external recipients
            </small>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label htmlFor="is_active">
              Active Schedule
              <small>(Uncheck to pause this schedule)</small>
            </label>
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
