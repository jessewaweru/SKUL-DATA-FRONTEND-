// src/components/SchoolDashboard/Reports/ReportBuilder.jsx
import React, { useState } from "react";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";

const ReportBuilder = () => {
  const api = useApi();
  const [reportDesign, setReportDesign] = useState({
    name: "",
    description: "",
    fields: [],
    layout: "portrait",
    filters: [],
  });
  const [availableFields, setAvailableFields] = useState([
    { id: "student_name", label: "Student Name", type: "text" },
    { id: "admission_number", label: "Admission Number", type: "text" },
    { id: "class", label: "Class", type: "text" },
    { id: "subject", label: "Subject", type: "text" },
    { id: "score", label: "Score", type: "number" },
    { id: "grade", label: "Grade", type: "text" },
    { id: "attendance", label: "Attendance %", type: "number" },
    { id: "teacher_comment", label: "Teacher Comment", type: "text" },
    { id: "term", label: "Term", type: "text" },
    { id: "year", label: "Year", type: "text" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddField = (fieldId) => {
    const field = availableFields.find((f) => f.id === fieldId);
    if (field) {
      setReportDesign((prev) => ({
        ...prev,
        fields: [...prev.fields, { ...field, visible: true }],
      }));
    }
  };

  const handleRemoveField = (fieldId) => {
    setReportDesign((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
  };

  const handleToggleVisibility = (fieldId) => {
    setReportDesign((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, visible: !f.visible } : f
      ),
    }));
  };

  const handleAddFilter = () => {
    setReportDesign((prev) => ({
      ...prev,
      filters: [...prev.filters, { field: "", operator: "equals", value: "" }],
    }));
  };

  const handleRemoveFilter = (index) => {
    setReportDesign((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }));
  };

  const handleFilterChange = (index, field, value) => {
    setReportDesign((prev) => {
      const newFilters = [...prev.filters];
      newFilters[index][field] = value;
      return { ...prev, filters: newFilters };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.post("/api/reports/templates/", {
        ...reportDesign,
        template_type: "CUSTOM",
        content: {
          fields: reportDesign.fields,
          layout: reportDesign.layout,
          filters: reportDesign.filters,
        },
      });
      // Reset form after successful save
      setReportDesign({
        name: "",
        description: "",
        fields: [],
        layout: "portrait",
        filters: [],
      });
    } catch (error) {
      console.error("Error saving report template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="report-builder-container">
      <h2>Custom Report Builder</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Report Name</label>
          <input
            type="text"
            value={reportDesign.name}
            onChange={(e) =>
              setReportDesign((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={reportDesign.description}
            onChange={(e) =>
              setReportDesign((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Layout</label>
          <select
            value={reportDesign.layout}
            onChange={(e) =>
              setReportDesign((prev) => ({ ...prev, layout: e.target.value }))
            }
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div className="builder-section">
          <h3>Available Fields</h3>
          <div className="available-fields">
            {availableFields.map((field) => (
              <button
                key={field.id}
                type="button"
                className="field-tag"
                onClick={() => handleAddField(field.id)}
                disabled={reportDesign.fields.some((f) => f.id === field.id)}
              >
                {field.label}
              </button>
            ))}
          </div>
        </div>

        <div className="builder-section">
          <h3>Selected Fields</h3>
          {reportDesign.fields.length === 0 ? (
            <p className="empty-message">No fields selected</p>
          ) : (
            <div className="selected-fields">
              {reportDesign.fields.map((field) => (
                <div key={field.id} className="field-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={field.visible}
                      onChange={() => handleToggleVisibility(field.id)}
                    />
                    {field.label}
                  </label>
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => handleRemoveField(field.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="builder-section">
          <div className="section-header">
            <h3>Filters</h3>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleAddFilter}
            >
              <FiPlus /> Add Filter
            </button>
          </div>

          {reportDesign.filters.length === 0 ? (
            <p className="empty-message">No filters added</p>
          ) : (
            <div className="filters-list">
              {reportDesign.filters.map((filter, index) => (
                <div key={index} className="filter-item">
                  <select
                    value={filter.field}
                    onChange={(e) =>
                      handleFilterChange(index, "field", e.target.value)
                    }
                  >
                    <option value="">Select Field</option>
                    {reportDesign.fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) =>
                      handleFilterChange(index, "operator", e.target.value)
                    }
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater">Greater Than</option>
                    <option value="less">Less Than</option>
                  </select>

                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                    placeholder="Value"
                  />

                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setReportDesign({
                name: "",
                description: "",
                fields: [],
                layout: "portrait",
                filters: [],
              })
            }
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={
              isSaving || !reportDesign.name || reportDesign.fields.length === 0
            }
          >
            <FiSave /> {isSaving ? "Saving..." : "Save Report Template"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportBuilder;
