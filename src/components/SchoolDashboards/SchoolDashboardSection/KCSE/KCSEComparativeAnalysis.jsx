import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSEComparativeAnalysis = () => {
  const api = useApi();
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYears, setSelectedYears] = useState([
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
  ]);
  const [availableYears, setAvailableYears] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await api.get("/kcse/school-performance/trends/");
        const years = response.data
          .map((item) => item.year)
          .sort((a, b) => b - a);
        setAvailableYears(years);
        if (years.length >= 2) {
          setSelectedYears([years[1], years[0]]);
        }
      } catch (err) {
        console.error("Failed to fetch available years:", err);
      }
    };

    fetchAvailableYears();
  }, [api]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedYears.length < 2) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/kcse/school-performance/comparison/?years=${selectedYears.join(
            ","
          )}`
        );
        setComparisonData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch comparison data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedYears, api]);

  const handleYearChange = (index, year) => {
    const newYears = [...selectedYears];
    newYears[index] = parseInt(year);
    setSelectedYears(newYears);
  };

  return (
    <div className="comparative-analysis-container">
      <div className="analysis-header">
        <h2>Comparative Analysis</h2>

        <div className="controls">
          <div className="year-selectors">
            <select
              value={selectedYears[0]}
              onChange={(e) => handleYearChange(0, e.target.value)}
              disabled={loading}
            >
              {availableYears.map((year) => (
                <option key={`year1-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span>vs</span>
            <select
              value={selectedYears[1]}
              onChange={(e) => handleYearChange(1, e.target.value)}
              disabled={loading}
            >
              {availableYears.map((year) => (
                <option key={`year2-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>
            <button
              className={viewMode === "chart" ? "active" : ""}
              onClick={() => setViewMode("chart")}
            >
              Chart View
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">Loading comparison data...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && comparisonData.length > 0 && (
        <div className="analysis-content">
          {viewMode === "table" ? (
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {comparisonData.map((item) => (
                    <th key={item.year}>{item.year}</th>
                  ))}
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mean Grade</td>
                  {comparisonData.map((item) => (
                    <td
                      key={`grade-${item.year}`}
                      className={`grade-${item.mean_grade
                        .replace("+", "plus")
                        .replace("-", "minus")}`}
                    >
                      {item.mean_grade}
                    </td>
                  ))}
                  <td
                    className={
                      comparisonData[0].mean_grade ===
                      comparisonData[1].mean_grade
                        ? ""
                        : comparisonData[0].mean_grade >
                          comparisonData[1].mean_grade
                        ? "positive"
                        : "negative"
                    }
                  >
                    {comparisonData[0].mean_grade ===
                    comparisonData[1].mean_grade
                      ? "No change"
                      : comparisonData[0].mean_grade >
                        comparisonData[1].mean_grade
                      ? "Improved"
                      : "Declined"}
                  </td>
                </tr>
                <tr>
                  <td>Mean Points</td>
                  {comparisonData.map((item) => (
                    <td key={`points-${item.year}`}>{item.mean_points}</td>
                  ))}
                  <td
                    className={
                      comparisonData[0].mean_points ===
                      comparisonData[1].mean_points
                        ? ""
                        : comparisonData[0].mean_points >
                          comparisonData[1].mean_points
                        ? "positive"
                        : "negative"
                    }
                  >
                    {comparisonData[0].mean_points ===
                    comparisonData[1].mean_points
                      ? "No change"
                      : comparisonData[0].mean_points >
                        comparisonData[1].mean_points
                      ? `+${(
                          comparisonData[0].mean_points -
                          comparisonData[1].mean_points
                        ).toFixed(2)}`
                      : `${(
                          comparisonData[0].mean_points -
                          comparisonData[1].mean_points
                        ).toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td>University Qualified</td>
                  {comparisonData.map((item) => (
                    <td key={`qualified-${item.year}`}>
                      {item.university_qualified} (
                      {Math.round(
                        (item.university_qualified / item.total_students) * 100
                      )}
                      %)
                    </td>
                  ))}
                  <td
                    className={
                      comparisonData[0].university_qualified ===
                      comparisonData[1].university_qualified
                        ? ""
                        : comparisonData[0].university_qualified >
                          comparisonData[1].university_qualified
                        ? "positive"
                        : "negative"
                    }
                  >
                    {comparisonData[0].university_qualified ===
                    comparisonData[1].university_qualified
                      ? "No change"
                      : comparisonData[0].university_qualified >
                        comparisonData[1].university_qualified
                      ? `+${
                          comparisonData[0].university_qualified -
                          comparisonData[1].university_qualified
                        }`
                      : `${
                          comparisonData[0].university_qualified -
                          comparisonData[1].university_qualified
                        }`}
                  </td>
                </tr>
                <tr>
                  <td>Total Students</td>
                  {comparisonData.map((item) => (
                    <td key={`total-${item.year}`}>{item.total_students}</td>
                  ))}
                  <td
                    className={
                      comparisonData[0].total_students ===
                      comparisonData[1].total_students
                        ? ""
                        : comparisonData[0].total_students >
                          comparisonData[1].total_students
                        ? "positive"
                        : "negative"
                    }
                  >
                    {comparisonData[0].total_students ===
                    comparisonData[1].total_students
                      ? "No change"
                      : comparisonData[0].total_students >
                        comparisonData[1].total_students
                      ? `+${
                          comparisonData[0].total_students -
                          comparisonData[1].total_students
                        }`
                      : `${
                          comparisonData[0].total_students -
                          comparisonData[1].total_students
                        }`}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="chart-view">
              <p className="chart-placeholder">
                Chart visualization would be implemented here with a library
                like Chart.js or D3.js
              </p>
              <div className="chart-mockup">
                <div
                  className="chart-bar"
                  style={{
                    height: "100px",
                    width: "80%",
                    backgroundColor: "#4a0e4e",
                  }}
                ></div>
                <div
                  className="chart-bar"
                  style={{
                    height: "70px",
                    width: "80%",
                    backgroundColor: "#6a1b9a",
                  }}
                ></div>
                <div className="chart-labels">
                  <span>{selectedYears[0]}</span>
                  <span>{selectedYears[1]}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KCSEComparativeAnalysis;
