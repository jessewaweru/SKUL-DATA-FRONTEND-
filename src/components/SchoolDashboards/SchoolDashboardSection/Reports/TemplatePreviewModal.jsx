// src/components/SchoolDashboard/Reports/TemplatePreviewModal.jsx
import React from "react";
import { FiX, FiDownload } from "react-icons/fi";
import "../Reports/reports.css";

const TemplatePreviewModal = ({ template, onClose }) => {
  const getPreviewContent = () => {
    if (!template) return "<p>No preview available</p>";

    // Generate preview based on template type
    switch (template.template_type) {
      case "ACADEMIC":
        return `
          <div class="template-preview academic-template">
            <div class="header">
              <h2>${template.name}</h2>
              <div class="school-info">
                <p>Sample School Name</p>
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
                  <td>Good effort, needs more practice</td>
                </tr>
              </tbody>
            </table>
            
            <div class="teacher-comments">
              <h4>Teacher's Overall Comments:</h4>
              <p>John has shown remarkable improvement this term. He participates actively in class.</p>
            </div>
          </div>
        `;
      case "ATTENDANCE":
        return `
          <div class="template-preview attendance-template">
            <h2>${template.name}</h2>
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
          </div>
        `;
      case "PAYROLL":
        return `
          <div class="template-preview payroll-template">
            <h2>${template.name}</h2>
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
                <tr class="total">
                  <td><strong>Net Salary</strong></td>
                  <td><strong>KSh 88,000</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      default:
        return `
          <div class="template-preview">
            <h2>${template.name}</h2>
            <p>This is a preview of the ${template.template_type} template.</p>
            <p>Content structure will be generated dynamically when used.</p>
          </div>
        `;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="template-preview-modal">
        <div className="modal-header">
          <h2>Template Preview: {template?.name}</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div
            className="template-preview-content"
            dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
          />
        </div>

        <div className="modal-footer">
          <p className="template-type">
            Type: <span>{template?.template_type}</span>
          </p>
          <p className="template-description">
            {template?.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
