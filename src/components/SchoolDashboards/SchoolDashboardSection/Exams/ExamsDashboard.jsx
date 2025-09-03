import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import ExamStatsCard from "../../../common/ExamManagement/ExamStatsCard";

const ExamsDashboard = () => {
  const { get } = useApi();
  const [stats, setStats] = useState({
    upcomingExams: 0,
    examsInProgress: 0,
    marksEntered: 0,
    resultsPublished: 0,
    totalExams: 0,
    publishedExams: 0,
    completedExams: 0,
  });
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      console.log("Fetching exam stats...");
      const response = await get("/exams/stats/");
      console.log("Stats response:", response);

      if (response && response.data) {
        setStats(response.data);
      } else {
        console.warn("No data in stats response");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Don't set error state here, just use default values
    }
  };

  const fetchRecentExams = async () => {
    try {
      console.log("Fetching recent exams...");
      const response = await get("/exams/recent/");
      console.log("Recent exams response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        setRecentExams(response.data);
      } else {
        console.warn("No data in recent exams response");
        setRecentExams([]);
      }
    } catch (error) {
      console.error("Error fetching recent exams:", error);
      // Don't set error state here, just use empty array
      setRecentExams([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data sequentially to better handle errors
        await fetchStats();
        await fetchRecentExams();
      } catch (error) {
        console.error("General error fetching data:", error);
        setError("Failed to fetch some data. Using default values.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusClass = (status) => {
    if (!status) return "status-default";

    switch (status.toLowerCase()) {
      case "upcoming":
        return "status-upcoming";
      case "ongoing":
        return "status-ongoing";
      case "completed":
        return "status-completed";
      default:
        return "status-default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading exam data...</div>
      </div>
    );
  }

  return (
    <div className="exams-dashboard">
      <div className="dashboard-header">
        <h2>Exam Management Dashboard</h2>
        <p>Overview of all exam activities and statistics</p>
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <ExamStatsCard
          title="Upcoming Exams"
          value={stats.upcomingExams || 0}
          icon="calendar"
        />
        <ExamStatsCard
          title="Exams In Progress"
          value={stats.examsInProgress || 0}
          icon="clock"
        />
        <ExamStatsCard
          title="Marks Entered"
          value={stats.marksEntered || 0}
          icon="check"
        />
        <ExamStatsCard
          title="Results Published"
          value={stats.resultsPublished || 0}
          icon="publish"
        />
      </div>

      <div className="additional-stats">
        <div className="stat-item">
          <span className="stat-label">Total Exams</span>
          <span className="stat-value">{stats.totalExams || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Published</span>
          <span className="stat-value">{stats.publishedExams || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completedExams || 0}</span>
        </div>
      </div>

      <div className="recent-exams-section">
        <div className="section-header">
          <h3>Recent Exams</h3>
          <div className="exam-count">{recentExams.length} exams</div>
        </div>

        {!recentExams || recentExams.length === 0 ? (
          <div className="no-data-message">
            <p>No recent exams found. Create your first exam to get started!</p>
            <button className="create-exam-btn">Create New Exam</button>
          </div>
        ) : (
          <div className="exams-table-container">
            <table className="exams-table">
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Type</th>
                  <th>Class</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="exam-name">{exam.name || "Unnamed Exam"}</td>
                    <td>{exam.exam_type || "N/A"}</td>
                    <td>{exam.school_class || "N/A"}</td>
                    <td>
                      {exam.term || "N/A"} {exam.academic_year || ""}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          exam.status
                        )}`}
                      >
                        {exam.status || "Unknown"}
                      </span>
                    </td>
                    <td>{formatDate(exam.start_date)}</td>
                    <td>
                      <span
                        className={`published-badge ${
                          exam.is_published ? "published" : "unpublished"
                        }`}
                      >
                        {exam.is_published ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        title="View Details"
                      >
                        View
                      </button>
                      {exam.status === "Completed" && !exam.is_published && (
                        <button
                          className="action-btn publish-btn"
                          title="Publish Results"
                        >
                          Publish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .exams-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .dashboard-header p {
          color: #7f8c8d;
          margin: 0 0 10px 0;
        }

        .error-banner {
          background: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .additional-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          justify-content: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }

        .recent-exams-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .section-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .exam-count {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          color: #6c757d;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 18px;
          color: #6c757d;
        }

        .no-data-message {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-data-message p {
          margin-bottom: 20px;
          font-size: 16px;
        }

        .create-exam-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .create-exam-btn:hover {
          background: #0056b3;
        }

        .exams-table-container {
          overflow-x: auto;
        }

        .exams-table {
          width: 100%;
          border-collapse: collapse;
        }

        .exams-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #e9ecef;
          white-space: nowrap;
        }

        .exams-table td {
          padding: 12px;
          border-bottom: 1px solid #e9ecef;
        }

        .exam-name {
          font-weight: 500;
          color: #2c3e50;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-upcoming {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-ongoing {
          background: #fff3e0;
          color: #f57c00;
        }

        .status-completed {
          background: #e8f5e8;
          color: #388e3c;
        }

        .status-default {
          background: #f5f5f5;
          color: #666;
        }

        .published-badge {
          padding: 3px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 500;
        }

        .published-badge.published {
          background: #d4edda;
          color: #155724;
        }

        .published-badge.unpublished {
          background: #f8d7da;
          color: #721c24;
        }

        .actions-cell {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
        }

        .view-btn {
          background: #17a2b8;
          color: white;
        }

        .view-btn:hover {
          background: #138496;
        }

        .publish-btn {
          background: #28a745;
          color: white;
        }

        .publish-btn:hover {
          background: #218838;
        }

        @media (max-width: 768px) {
          .additional-stats {
            flex-direction: column;
            gap: 15px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .exams-table-container {
            overflow-x: scroll;
          }
        }
      `}</style>
    </div>
  );
};

export default ExamsDashboard;
