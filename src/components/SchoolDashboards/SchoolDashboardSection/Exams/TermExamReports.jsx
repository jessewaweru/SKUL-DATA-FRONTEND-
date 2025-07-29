import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const TermExamReports = () => {
  const { termId } = useParams();
  const { get } = useApi();
  const navigate = useNavigate();
  const [termData, setTermData] = useState(null);
  const [classReports, setClassReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const [term, year] = termId.split("-");
    const fetchData = async () => {
      try {
        const [examsRes, reportsRes] = await Promise.all([
          get(`/exams/?term=${term}&academic_year=${year}`),
          get(`/exams/term-reports/?term=${term}&academic_year=${year}`),
        ]);

        // Debug logging
        console.log("API Responses:", { examsRes, reportsRes });

        setTermData({
          term,
          academic_year: year,
          exams: Array.isArray(examsRes?.data) ? examsRes.data : [],
        });

        // Group reports by class
        const grouped = {};
        const reportsData = Array.isArray(reportsRes?.data)
          ? reportsRes.data
          : [];

        reportsData.forEach((report) => {
          if (!grouped[report.school_class.id]) {
            grouped[report.school_class.id] = {
              class: report.school_class,
              reports: [],
            };
          }
          grouped[report.school_class.id].reports.push(report);
        });

        setClassReports(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching term data:", error);
        // Set empty arrays on error
        setTermData({
          term,
          academic_year: year,
          exams: [],
        });
        setClassReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [termId]);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="term-reports-container">
      <div className="term-header">
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard/exams/reports")}
        >
          Back to Reports
        </button>
        <h2>
          Term Reports: {termData.term} {termData.academic_year}
        </h2>
      </div>

      <div className="term-exams-list">
        <h3>Exams in this Term:</h3>
        <ul>
          {termData.exams.map((exam) => (
            <li key={exam.id}>
              {exam.name} - {exam.school_class.name} ({exam.status})
            </li>
          ))}
        </ul>
      </div>

      <div className="class-reports-section">
        <h3>Class Reports</h3>

        <div className="class-selector">
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classReports.map((cls) => (
              <option key={cls.class.id} value={cls.class.id}>
                {cls.class.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="class-report-details">
            {classReports
              .find((c) => c.class.id === parseInt(selectedClass))
              .reports.map((report) => (
                <div key={report.id} className="student-report-card">
                  <h4>
                    {report.student.first_name} {report.student.last_name}
                  </h4>
                  <p>Position: {report.overall_position}</p>
                  <p>Average: {report.average_score}</p>
                  <p>Grade: {report.overall_grade}</p>
                  <button
                    className="btn-secondary small"
                    onClick={() =>
                      navigate(
                        `/dashboard/reports/builder?student=${report.student.id}&term=${termData.term}&year=${termData.academic_year}`
                      )
                    }
                  >
                    Generate Full Report
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="term-actions">
        <button className="btn-primary">Generate All Reports</button>
        <button className="btn-secondary">Download Summary</button>
      </div>
    </div>
  );
};

export default TermExamReports;
