import { useEffect, useState } from "react";
import api from "../../../../services/api";
import MetricCard from "./MetricCard";
import TopTeachersChart from "./Charts/TopTeachersChart";
import AttendanceTrendChart from "./Charts/AttendanceTrendChart";
import DocumentUsageChart from "./Charts/DocumentUsageChart";
import ClassPerformanceChart from "./Charts/ClassPerformanceChart";
import "../Analytics/analytics.css";

const AnalyticsOverview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching analytics overview...");
        const response = await api.get("/analytics/overview/");
        console.log("Analytics response:", response.data);

        setOverviewData(response.data);
      } catch (error) {
        console.error("Error fetching analytics overview:", error);

        // Set a user-friendly error message
        if (error.response?.status === 403) {
          setError(
            "You don't have permission to view analytics data. Please contact your administrator."
          );
        } else if (error.response?.status === 401) {
          setError("Please log in to view analytics data.");
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load analytics data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div>Loading analytics...</div>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Unable to Load Analytics</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Provide fallback data structure if overviewData is null
  const safeOverviewData = overviewData || {
    most_active_teacher: { name: "N/A", login_count: 0 },
    student_attendance_rate: 0,
    most_downloaded_document: { title: "N/A", download_count: 0 },
    top_performing_class: { class_name: "N/A", average_score: 0 },
    reports_generated: 0,
    teacher_activity: [],
    attendance_trend: [],
    document_usage: [],
    class_performance: [],
  };

  return (
    <div className="analytics-overview">
      <div className="analytics-header">
        <h2>Analytics Overview</h2>
        <p>Key performance indicators for your school</p>
      </div>

      <div className="top-metrics-grid">
        <MetricCard
          title="Most Active Teacher"
          value={safeOverviewData?.most_active_teacher?.name || "N/A"}
          change={safeOverviewData?.most_active_teacher?.login_count || 0}
          icon="teacher"
          trend="up"
        />
        <MetricCard
          title="Student Attendance"
          value={`${(safeOverviewData?.student_attendance_rate || 0).toFixed(
            1
          )}%`}
          change={2.5} // You might want to calculate this from historical data
          icon="attendance"
          trend="up"
        />
        <MetricCard
          title="Top Document"
          value={safeOverviewData?.most_downloaded_document?.title || "N/A"}
          change={
            safeOverviewData?.most_downloaded_document?.download_count || 0
          }
          icon="document"
          trend="up"
        />
        <MetricCard
          title="Top Performing Class"
          value={safeOverviewData?.top_performing_class?.class_name || "N/A"}
          change={Math.round(
            safeOverviewData?.top_performing_class?.average_score || 0
          )}
          icon="class"
          trend="up"
        />
        <MetricCard
          title="Reports Generated"
          value={safeOverviewData?.reports_generated || 0}
          change={15} // You might want to calculate this from historical data
          icon="report"
          trend="up"
        />
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-container">
          <h3>Top Teachers by Activity</h3>
          {safeOverviewData?.teacher_activity?.length > 0 ? (
            <TopTeachersChart data={safeOverviewData.teacher_activity} />
          ) : (
            <div className="no-data-message">
              <p>No teacher activity data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Attendance Trend</h3>
          {safeOverviewData?.attendance_trend?.length > 0 ? (
            <AttendanceTrendChart data={safeOverviewData.attendance_trend} />
          ) : (
            <div className="no-data-message">
              <p>No attendance trend data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Document Usage</h3>
          {safeOverviewData?.document_usage?.length > 0 ? (
            <DocumentUsageChart data={safeOverviewData.document_usage} />
          ) : (
            <div className="no-data-message">
              <p>No document usage data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Class Performance</h3>
          {safeOverviewData?.class_performance?.length > 0 ? (
            <ClassPerformanceChart data={safeOverviewData.class_performance} />
          ) : (
            <div className="no-data-message">
              <p>No class performance data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
