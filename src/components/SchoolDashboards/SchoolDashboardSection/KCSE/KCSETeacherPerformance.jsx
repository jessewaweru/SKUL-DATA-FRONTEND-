import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSETeacherPerformance = () => {
  const api = useApi();
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [availableTeachers, setAvailableTeachers] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch available teachers
        const response = await api.get("/teachers/");
        setAvailableTeachers(response.data);
        if (response.data.length > 0) {
          setSelectedTeacher(response.data[0].id);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch teachers"
        );
      }
    };

    fetchInitialData();
  }, [api]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!selectedTeacher) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/kcse/subject-performance/teacher-performance/?teacher_id=${selectedTeacher}`
        );
        setTeacherData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch teacher data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [selectedTeacher, api]);

  return (
    <div className="teacher-performance-container">
      <div className="performance-header">
        <h2>Teacher Performance Analysis</h2>

        <div className="controls">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            disabled={loading || availableTeachers.length === 0}
          >
            {availableTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">Loading teacher data...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && teacherData.length > 0 && (
        <div className="teacher-performance-content">
          <div className="teacher-profile">
            <h3>
              {
                availableTeachers.find(
                  (t) => t.id.toString() === selectedTeacher
                )?.user.full_name
              }
            </h3>
            <p className="teacher-subjects">
              Subjects Taught:{" "}
              {availableTeachers
                .find((t) => t.id.toString() === selectedTeacher)
                ?.subjects_taught.map((s) => s.name)
                .join(", ")}
            </p>
          </div>

          <div className="performance-summary">
            <h3>KCSE Performance Summary</h3>
            <div className="summary-cards">
              <div className="kcse-summary-card">
                <h4>Best Subject</h4>
                <div className="summary-value">
                  {
                    teacherData.reduce((best, current) =>
                      best.mean_score > current.mean_score ? best : current
                    ).subject.name
                  }
                </div>
              </div>
              <div className="kcse-summary-card">
                <h4>Average Grade</h4>
                <div className="summary-value">
                  {teacherData.length > 0
                    ? teacherData.reduce((sum, item) => {
                        const gradePoints = {
                          A: 12,
                          "A-": 11,
                          "B+": 10,
                          B: 9,
                          "B-": 8,
                          "C+": 7,
                          C: 6,
                          "C-": 5,
                          "D+": 4,
                          D: 3,
                          "D-": 2,
                          E: 1,
                        };
                        return sum + (gradePoints[item.mean_grade] || 0);
                      }, 0) / teacherData.length
                    : "N/A"}
                </div>
              </div>
              <div className="kcse-summary-card">
                <h4>Average Pass Rate</h4>
                <div className="summary-value">
                  {teacherData.length > 0
                    ? `${Math.round(
                        (teacherData.reduce(
                          (sum, item) =>
                            sum + item.passed / item.total_students,
                          0
                        ) /
                          teacherData.length) *
                          100
                      )}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="subject-performance">
            <h3>Subject Performance Details</h3>
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Year</th>
                  <th>Mean Grade</th>
                  <th>Mean Score</th>
                  <th>Pass Rate</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {teacherData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subject.name}</td>
                    <td>{item.school_performance.year}</td>
                    <td
                      className={`grade-${item.mean_grade
                        .replace("+", "plus")
                        .replace("-", "minus")}`}
                    >
                      {item.mean_grade}
                    </td>
                    <td>{item.mean_score}</td>
                    <td>
                      <div className="pass-rate-container">
                        <div
                          className="pass-rate-bar"
                          style={{
                            width: `${
                              (item.passed / item.total_students) * 100
                            }%`,
                          }}
                        ></div>
                        <span className="pass-rate-text">
                          {Math.round(
                            (item.passed / item.total_students) * 100
                          )}
                          %
                        </span>
                      </div>
                    </td>
                    <td>{item.total_students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default KCSETeacherPerformance;
