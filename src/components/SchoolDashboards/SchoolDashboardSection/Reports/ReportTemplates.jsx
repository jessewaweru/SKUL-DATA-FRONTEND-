// src/components/SchoolDashboard/Reports/ReportTemplates.jsx
import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import TemplatePreviewModal from "./TemplatePreviewModal";
import TemplateEditor from "./TemplateEditor";
import "../Reports/reports.css";

const ReportTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [filter, setFilter] = useState("all");
  const api = useApi();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/reports/templates/");
        setTemplates(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    if (filter === "all") return true;
    return template.template_type === filter;
  });

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await api.delete(`/api/reports/templates/${templateId}/`);
        setTemplates(templates.filter((t) => t.id !== templateId));
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setShowEditor(true);
  };

  const handleSaveTemplate = (savedTemplate) => {
    if (selectedTemplate) {
      setTemplates(
        templates.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
      );
    } else {
      setTemplates([...templates, savedTemplate]);
    }
    setShowEditor(false);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h2>Report Templates</h2>
        <div className="templates-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="BEHAVIOR">Behavior</option>
            <option value="PAYROLL">Payroll</option>
            <option value="ENROLLMENT">Enrollment</option>
          </select>
          <button className="btn-primary" onClick={handleCreateNew}>
            <FiPlus /> New Template
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <h3>{template.name}</h3>
                <span
                  className={`template-type ${template.template_type.toLowerCase()}`}
                >
                  {template.template_type}
                </span>
              </div>
              <p className="template-description">
                {template.description || "No description provided"}
              </p>
              <div className="template-footer">
                <div className="template-meta">
                  <span>
                    Created:{" "}
                    {new Date(template.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="template-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handlePreview(template)}
                    title="Preview"
                  >
                    <FiEye />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(template)}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(template.id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPreview && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showEditor && (
        <TemplateEditor
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ReportTemplates;
