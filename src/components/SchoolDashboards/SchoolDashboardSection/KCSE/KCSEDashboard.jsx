import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import "./kcsemanagement.css";

const KCSEDashboard = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [performances, setPerformances] = useState([]);
  const [latestPerformance, setLatestPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/kcse/school-performance/");
        setPerformances(response.data.results);

        if (response.data.results && response.data.results.length > 0) {
          setLatestPerformance(response.data.results[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [api]);

  const handleViewResults = (year) => {
    navigate(`/dashboard/exams/kcse/results?year=${year}`);
  };

  const handleGenerateReports = () => {
    navigate("/dashboard/exams/kcse/comparative-analysis");
  };

  const handleUploadResults = () => {
    navigate("/dashboard/exams/kcse/upload-results");
  };

  const handleDownloadTemplate = () => {
    navigate("/dashboard/exams/kcse/download-template");
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="kcse-dashboard">
      <h2>KCSE Performance Overview</h2>

      <div className="kcse-stats-grid">
        <div className="kcse-stat-card">
          <h3>Latest Mean Grade</h3>
          <p className="kcse-stat-value">
            {latestPerformance?.mean_grade || "N/A"}
          </p>
          <p className="kcse-stat-label">{latestPerformance?.year || ""}</p>
        </div>

        <div className="kcse-stat-card">
          <h3>Mean Points</h3>
          <p className="kcse-stat-value">
            {latestPerformance?.mean_points || "N/A"}
          </p>
          <p className="kcse-stat-label">Avg per student</p>
        </div>

        <div className="kcse-stat-card">
          <h3>University Qualified</h3>
          <p className="kcse-stat-value">
            {latestPerformance?.university_qualified || "0"}
          </p>
          <p className="kcse-stat-label">
            out of {latestPerformance?.total_students || "0"}
          </p>
        </div>

        <div className="kcse-stat-card">
          <h3>Qualification Rate</h3>
          <p className="kcse-stat-value">
            {latestPerformance && latestPerformance.total_students > 0
              ? `${Math.round(
                  (latestPerformance.university_qualified /
                    latestPerformance.total_students) *
                    100
                )}%`
              : "0%"}
          </p>
          <p className="kcse-stat-label">C+ and above</p>
        </div>
      </div>

      <div className="recent-results">
        <h3>Recent KCSE Years</h3>
        <div className="years-list">
          {performances.map((performance) => (
            <div key={performance.year} className="year-item">
              <span>{performance.year}</span>
              <button
                className="kcse-view-button"
                onClick={() => handleViewResults(performance.year)}
              >
                View Results
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="kcse-quick-actions">
        <h3>Quick Actions</h3>
        <div className="kcse-action-buttons">
          <button
            className="kcse-action-button primary"
            onClick={handleUploadResults}
          >
            Upload New Results
          </button>
          <button
            className="kcse-action-button secondary"
            onClick={handleDownloadTemplate}
          >
            Download Template
          </button>
          <button
            className="kcse-action-button tertiary"
            onClick={handleGenerateReports}
          >
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default KCSEDashboard;
