// src/components/SchoolDashboard/Reports/GenerateReportModal.jsx
import React, { useState, useEffect } from "react";
import { FiX, FiFileText, FiUsers, FiCalendar } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import useUser from "../../../../hooks/useUser";
import "../Reports/reports.css";

const GenerateReportModal = ({ onClose, onGenerate }) => {
  const { user } = useUser();
  const api = useApi();
  const [templates, setTemplates] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    template: "",
    report_type: "ACADEMIC",
    title: "",
    class: "",
    student: "",
    term: "Term 1",
    school_year: new Date().getFullYear(),
    format: "PDF",
    parameters: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, classesRes] = await Promise.all([
          api.get("/api/reports/templates/"),
          user.user_type === "teacher"
            ? Promise.resolve({
                data: [user.teacher_profile.assigned_class],
              })
            : api.get("/api/schools/classes/"),
        ]);

        setTemplates(templatesRes.data);
        setClasses(classesRes.data);

        if (user.user_type === "teacher") {
          const studentsRes = await api.get(
            `/api/students/?class=${user.teacher_profile.assigned_class.id}`
          );
          setStudents(studentsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassChange = async (classId) => {
    if (!classId) return;
    try {
      const response = await api.get(`/api/students/?class=${classId}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        template: formData.template,
        title:
          formData.title ||
          `${formData.report_type} Report - ${formData.term} ${formData.school_year}`,
        parameters: {
          class: formData.class,
          student: formData.student,
          term: formData.term,
          school_year: formData.school_year,
          ...formData.parameters,
        },
        format: formData.format,
      };

      await api.post("/api/reports/generate/", payload);
      onGenerate();
      onClose();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStudentSelector = () => {
    if (
      formData.report_type === "ACADEMIC" ||
      formData.report_type === "ATTENDANCE"
    ) {
      return (
        <div className="form-group">
          <label>Student</label>
          <select
            name="student"
            value={formData.student}
            onChange={handleChange}
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const renderTermFields = () => {
    if (["ACADEMIC", "ATTENDANCE", "BEHAVIOR"].includes(formData.report_type)) {
      return (
        <>
          <div className="form-group">
            <label>Term</label>
            <select name="term" value={formData.term} onChange={handleChange}>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
              <option value="Mid-Term">Mid-Term</option>
              <option value="Full Year">Full Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>School Year</label>
            <input
              type="text"
              name="school_year"
              value={formData.school_year}
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="generate-report-modal">
        <div className="modal-header">
          <h2>Generate New Report</h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Report Type</label>
            <select
              name="report_type"
              value={formData.report_type}
              onChange={handleChange}
              required
            >
              <option value="ACADEMIC">Academic Performance</option>
              <option value="ATTENDANCE">Attendance</option>
              {user?.user_type === "school_superuser" && (
                <>
                  <option value="PAYROLL">Payroll</option>
                  <option value="ENROLLMENT">Enrollment</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Template</label>
            <select
              name="template"
              value={formData.template}
              onChange={handleChange}
              required
            >
              <option value="">Select a template</option>
              {templates
                .filter((t) => t.template_type === formData.report_type)
                .map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Report Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Leave blank for default title"
            />
          </div>

          <div className="form-group">
            <label>Class</label>
            <select
              name="class"
              value={formData.class}
              onChange={(e) => {
                handleChange(e);
                handleClassChange(e.target.value);
              }}
              required={formData.report_type === "ACADEMIC"}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {renderStudentSelector()}
          {renderTermFields()}

          <div className="form-group">
            <label>Format</label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              required
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateReportModal;
