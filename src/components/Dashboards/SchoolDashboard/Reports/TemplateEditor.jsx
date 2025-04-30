// src/components/SchoolDashboard/Reports/TemplateEditor.jsx
import React, { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import TemplateDesigner from "./TemplateDesigner";
import "../Reports/reports.css";

const TemplateEditor = ({ template, onSave, onClose }) => {
  const api = useApi();
  const [formData, setFormData] = useState({
    name: "",
    template_type: "ACADEMIC",
    description: "",
    content: {},
    is_system: false,
    ...template,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const templateTypes = [
    { value: "ACADEMIC", label: "Academic Performance" },
    { value: "ATTENDANCE", label: "Attendance" },
    { value: "BEHAVIOR", label: "Behavior" },
    { value: "PAYROLL", label: "Payroll" },
    { value: "ENROLLMENT", label: "Enrollment" },
    { value: "FINANCE", label: "Finance" },
    { value: "CUSTOM", label: "Custom" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let response;
      if (formData.id) {
        response = await api.put(
          `/api/reports/templates/${formData.id}/`,
          formData
        );
      } else {
        response = await api.post("/api/reports/templates/", formData);
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const generatePreview = () => {
    // Generate sample preview based on template type
    let html = "";
    switch (formData.template_type) {
      case "ACADEMIC":
        html = generateAcademicTemplatePreview(formData);
        break;
      case "ATTENDANCE":
        html = generateAttendanceTemplatePreview(formData);
        break;
      case "PAYROLL":
        html = generatePayrollTemplatePreview(formData);
        break;
      default:
        html =
          '<div class="template-preview"><p>Custom template preview</p></div>';
    }
    setPreviewHtml(html);
  };

  useEffect(() => {
    generatePreview();
  }, [formData.content, formData.template_type]);

  return (
    <div className="modal-overlay">
      <div className="template-editor-modal">
        <div className="modal-header">
          <h2>{template ? "Edit Template" : "Create New Template"}</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Template Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Template Type</label>
            <select
              name="template_type"
              value={formData.template_type}
              onChange={handleChange}
              required
            >
              {templateTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Template Design</label>
            <TemplateDesigner
              templateType={formData.template_type}
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>

          <div className="form-group">
            <label>Preview</label>
            <div
              className="template-preview-container"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <FiSave /> {isSaving ? "Saving..." : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sample template preview generators
const generateAcademicTemplatePreview = (template) => `
  <div class="academic-report-preview">
    <div class="report-header">
      <h2>${template.name || "Academic Performance Report"}</h2>
      <div class="school-info">
        <p>Peponi School</p>
        <p>Term: 1, 2023</p>
      </div>
    </div>
    
    <div class="student-info">
      <h3>Student: John Doe</h3>
      <p>Class: Form 1A</p>
      <p>Admission No: 12345</p>
    </div>
    
    <table class="grades-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Score</th>
          <th>Grade</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Mathematics</td>
          <td>85%</td>
          <td>A</td>
          <td>Excellent performance</td>
        </tr>
        <tr>
          <td>English</td>
          <td>78%</td>
          <td>B+</td>
          <td>Good effort, needs more practice in writing</td>
        </tr>
      </tbody>
    </table>
    
    <div class="teacher-comments">
      <h4>Teacher's Overall Comments:</h4>
      <p>John has shown remarkable improvement this term. He participates actively in class and completes assignments on time.</p>
    </div>
    
    <div class="report-footer">
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
`;

const generateAttendanceTemplatePreview = (template) => `
  <div class="attendance-report-preview">
    <h2>${template.name || "Attendance Report"}</h2>
    <div class="student-info">
      <p>Student: Jane Smith</p>
      <p>Class: Form 2B</p>
      <p>Term: 1, 2023</p>
    </div>
    
    <table class="attendance-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Days Present</th>
          <th>Days Absent</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>January</td>
          <td>18</td>
          <td>2</td>
          <td>90%</td>
        </tr>
        <tr>
          <td>February</td>
          <td>20</td>
          <td>0</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
    
    <div class="summary">
      <p><strong>Total Present:</strong> 38 days</p>
      <p><strong>Total Absent:</strong> 2 days</p>
      <p><strong>Overall Attendance:</strong> 95%</p>
    </div>
  </div>
`;

const generatePayrollTemplatePreview = (template) => `
  <div class="payroll-report-preview">
    <h2>${template.name || "Payroll Report"}</h2>
    <div class="teacher-info">
      <p>Teacher: Mr. James Peterson</p>
      <p>Month: March 2023</p>
    </div>
    
    <table class="payroll-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Basic Salary</td>
          <td>KSh 85,000</td>
        </tr>
        <tr>
          <td>Allowances</td>
          <td>KSh 15,000</td>
        </tr>
        <tr>
          <td>PAYE</td>
          <td>KSh 12,000</td>
        </tr>
        <tr>
          <td>NSSF</td>
          <td>KSh 1,080</td>
        </tr>
        <tr class="total">
          <td><strong>Net Salary</strong></td>
          <td><strong>KSh 86,920</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
`;

export default TemplateEditor;
