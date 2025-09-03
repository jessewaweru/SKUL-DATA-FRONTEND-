import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSESchoolPerformance = () => {
  const api = useApi();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await api.get("/kcse/school-performance/trends/");
        const years = response.data
          .map((item) => item.year)
          .sort((a, b) => b - a);
        setAvailableYears(years);
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error("Failed to fetch available years:", err);
      }
    };

    fetchAvailableYears();
  }, [api]);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!selectedYear) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/kcse/school-performance/?year=${selectedYear}`
        );

        if (response.data.results && response.data.results.length > 0) {
          setPerformance(response.data.results[0]);
        } else {
          setPerformance(null);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch performance data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [selectedYear, api]);

  return (
    <div className="school-performance-container">
      <div className="performance-header">
        <h2>School Performance Overview</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          disabled={loading}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="loading-spinner">Loading performance data...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && performance && (
        <div className="kcse-performance-content">
          <div className="kcse-performance-summary">
            <div className="kcse-summary-card">
              <h3>Mean Grade</h3>
              <div className="summary-value grade">
                {performance.mean_grade}
              </div>
            </div>
            <div className="kcse-summary-card">
              <h3>Mean Points</h3>
              <div className="summary-value points">
                {performance.mean_points}
              </div>
            </div>
            <div className="kcse-summary-card">
              <h3>University Qualified</h3>
              <div className="summary-value qualified">
                {performance.university_qualified} /{" "}
                {performance.total_students}
              </div>
              <div className="summary-percentage">
                (
                {Math.round(
                  (performance.university_qualified /
                    performance.total_students) *
                    100
                )}
                %)
              </div>
            </div>
          </div>

          <div className="subject-performance">
            <h3>Subject Performance</h3>
            {performance.subject_performances &&
            performance.subject_performances.length > 0 ? (
              <table className="kcse-subject-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Mean Grade</th>
                    <th>Mean Score</th>
                    <th>Pass Rate</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.subject_performances.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.subject?.name || "N/A"}</td>
                      <td>{subject.subject_code}</td>
                      <td
                        className={`grade-${subject.mean_grade
                          ?.replace("+", "plus")
                          ?.replace("-", "minus")}`}
                      >
                        {subject.mean_grade}
                      </td>
                      <td>{subject.mean_score}</td>
                      <td>
                        <div className="pass-rate-container">
                          <div
                            className="pass-rate-bar"
                            style={{
                              width: `${
                                (subject.passed / subject.total_students) * 100
                              }%`,
                            }}
                          ></div>
                          <span className="pass-rate-text">
                            {Math.round(
                              (subject.passed / subject.total_students) * 100
                            )}
                            %
                          </span>
                        </div>
                      </td>
                      <td>
                        {subject.subject_teacher?.user?.full_name ||
                          "Not assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No subject performance data available for {selectedYear}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KCSESchoolPerformance;
