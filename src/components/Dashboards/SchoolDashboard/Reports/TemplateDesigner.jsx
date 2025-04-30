// src/components/SchoolDashboard/Reports/TemplateDesigner.jsx
import React, { useState, useEffect } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiImage,
  FiTable,
} from "react-icons/fi";
import "../Reports/reports.css";

const TemplateDesigner = ({ templateType, content, onChange }) => {
  const [design, setDesign] = useState(content || {});
  const [activeTab, setActiveTab] = useState("content");

  // Initialize with default structure based on template type
  useEffect(() => {
    if (!content || Object.keys(content).length === 0) {
      const defaultDesign = getDefaultDesign(templateType);
      setDesign(defaultDesign);
      onChange(defaultDesign);
    }
  }, [templateType]);

  const getDefaultDesign = (type) => {
    switch (type) {
      case "ACADEMIC":
        return {
          header: {
            schoolName: true,
            logo: true,
            title: "Academic Performance Report",
            termInfo: true,
          },
          studentInfo: {
            name: true,
            admissionNumber: true,
            className: true,
          },
          subjectsTable: {
            include: true,
            columns: ["Subject", "Score", "Grade", "Comments"],
          },
          teacherComments: {
            include: true,
            sections: ["General", "Strengths", "Improvements"],
          },
          footer: {
            date: true,
            signature: false,
          },
          styles: {
            fontFamily: "Arial",
            primaryColor: "#3498db",
            secondaryColor: "#2c3e50",
          },
        };
      case "ATTENDANCE":
        return {
          header: {
            schoolName: true,
            title: "Attendance Report",
          },
          studentInfo: {
            name: true,
            className: true,
            period: true,
          },
          attendanceTable: {
            include: true,
            periods: ["Weekly", "Monthly", "Termly"],
          },
          summary: {
            include: true,
            showPercentage: true,
          },
          styles: {
            fontFamily: "Arial",
            primaryColor: "#2ecc71",
          },
        };
      default:
        return {
          header: {
            title: "Custom Report",
          },
          content: [],
          styles: {
            fontFamily: "Arial",
            primaryColor: "#9b59b6",
          },
        };
    }
  };

  const handleFieldToggle = (section, field) => {
    const newDesign = {
      ...design,
      [section]: {
        ...design[section],
        [field]: !design[section][field],
      },
    };
    setDesign(newDesign);
    onChange(newDesign);
  };

  const handleStyleChange = (property, value) => {
    const newDesign = {
      ...design,
      styles: {
        ...design.styles,
        [property]: value,
      },
    };
    setDesign(newDesign);
    onChange(newDesign);
  };

  const renderAcademicDesigner = () => (
    <div className="designer-content">
      <div className="design-section">
        <h4>Header</h4>
        <div className="design-options">
          <label>
            <input
              type="checkbox"
              checked={design.header?.schoolName || false}
              onChange={() => handleFieldToggle("header", "schoolName")}
            />
            School Name
          </label>
          <label>
            <input
              type="checkbox"
              checked={design.header?.logo || false}
              onChange={() => handleFieldToggle("header", "logo")}
            />
            School Logo
          </label>
          <label>
            <input
              type="checkbox"
              checked={design.header?.termInfo || false}
              onChange={() => handleFieldToggle("header", "termInfo")}
            />
            Term Information
          </label>
        </div>
      </div>

      <div className="design-section">
        <h4>Student Information</h4>
        <div className="design-options">
          <label>
            <input
              type="checkbox"
              checked={design.studentInfo?.name || false}
              onChange={() => handleFieldToggle("studentInfo", "name")}
            />
            Student Name
          </label>
          <label>
            <input
              type="checkbox"
              checked={design.studentInfo?.admissionNumber || false}
              onChange={() =>
                handleFieldToggle("studentInfo", "admissionNumber")
              }
            />
            Admission Number
          </label>
          <label>
            <input
              type="checkbox"
              checked={design.studentInfo?.className || false}
              onChange={() => handleFieldToggle("studentInfo", "className")}
            />
            Class Name
          </label>
        </div>
      </div>

      <div className="design-section">
        <h4>Subjects Table</h4>
        <div className="design-options">
          <label>
            <input
              type="checkbox"
              checked={design.subjectsTable?.include || false}
              onChange={() => handleFieldToggle("subjectsTable", "include")}
            />
            Include Subjects Table
          </label>
          {design.subjectsTable?.include && (
            <div className="columns-list">
              <h5>Columns:</h5>
              {design.subjectsTable.columns?.map((column, index) => (
                <div key={index} className="column-item">
                  <input
                    type="text"
                    value={column}
                    onChange={(e) => {
                      const newColumns = [...design.subjectsTable.columns];
                      newColumns[index] = e.target.value;
                      const newDesign = {
                        ...design,
                        subjectsTable: {
                          ...design.subjectsTable,
                          columns: newColumns,
                        },
                      };
                      setDesign(newDesign);
                      onChange(newDesign);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAttendanceDesigner = () => (
    <div className="designer-content">
      <div className="design-section">
        <h4>Header</h4>
        <div className="design-options">
          <label>
            <input
              type="checkbox"
              checked={design.header?.schoolName || false}
              onChange={() => handleFieldToggle("header", "schoolName")}
            />
            School Name
          </label>
        </div>
      </div>

      <div className="design-section">
        <h4>Attendance Data</h4>
        <div className="design-options">
          <label>
            <input
              type="checkbox"
              checked={design.attendanceTable?.include || false}
              onChange={() => handleFieldToggle("attendanceTable", "include")}
            />
            Include Attendance Table
          </label>
        </div>
      </div>
    </div>
  );

  const renderCustomDesigner = () => (
    <div className="designer-content">
      <p>Custom template design options would go here.</p>
    </div>
  );

  const renderStyleEditor = () => (
    <div className="designer-content">
      <div className="design-section">
        <h4>Font</h4>
        <select
          value={design.styles?.fontFamily || "Arial"}
          onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>

      <div className="design-section">
        <h4>Colors</h4>
        <div className="color-picker">
          <label>
            Primary Color:
            <input
              type="color"
              value={design.styles?.primaryColor || "#3498db"}
              onChange={(e) =>
                handleStyleChange("primaryColor", e.target.value)
              }
            />
          </label>
          <label>
            Secondary Color:
            <input
              type="color"
              value={design.styles?.secondaryColor || "#2c3e50"}
              onChange={(e) =>
                handleStyleChange("secondaryColor", e.target.value)
              }
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderToolbar = () => (
    <div className="designer-toolbar">
      <button type="button" className="tool-button">
        <FiBold />
      </button>
      <button type="button" className="tool-button">
        <FiItalic />
      </button>
      <button type="button" className="tool-button">
        <FiUnderline />
      </button>
      <div className="tool-separator"></div>
      <button type="button" className="tool-button">
        <FiAlignLeft />
      </button>
      <button type="button" className="tool-button">
        <FiAlignCenter />
      </button>
      <button type="button" className="tool-button">
        <FiAlignRight />
      </button>
      <div className="tool-separator"></div>
      <button type="button" className="tool-button">
        <FiImage />
      </button>
      <button type="button" className="tool-button">
        <FiTable />
      </button>
    </div>
  );

  return (
    <div className="template-designer">
      {renderToolbar()}

      <div className="designer-tabs">
        <button
          className={`tab-button ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={`tab-button ${activeTab === "styles" ? "active" : ""}`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
      </div>

      {activeTab === "content" ? (
        <>
          {templateType === "ACADEMIC" && renderAcademicDesigner()}
          {templateType === "ATTENDANCE" && renderAttendanceDesigner()}
          {templateType === "CUSTOM" && renderCustomDesigner()}
        </>
      ) : (
        renderStyleEditor()
      )}
    </div>
  );
};

export default TemplateDesigner;
