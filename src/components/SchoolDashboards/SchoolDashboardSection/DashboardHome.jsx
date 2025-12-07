import { useState, useEffect } from "react";
import StatCards from "./StatCards";
import TransactionGraph from "./TransactionGraph";
import AttendanceChart from "./AttendanceChart";
import RecentActivityTable from "./RecentActivityTable";
import "../SchoolDashboardSection/dashboard.css";
import { useApi } from "../../../hooks/useApi";
import { createDashboardApi } from "../../../services/dashboardApi";

const DashboardHome = () => {
  const api = useApi();
  const dashboardApi = createDashboardApi(api);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      activeTeachers: 0,
      totalClasses: 0,
      totalDocuments: 0,
      avgAttendance: 0,
      pendingFees: 0,
      totalParents: 0,
    },
    trends: {
      attendance: [],
      revenue: [],
    },
    recentActivity: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setDashboardData(data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(
        err.message || "Failed to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid-container">
        <div
          style={{
            gridColumn: "span 12",
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-color)",
          }}
        >
          <div className="loading-spinner">
            <p>Loading dashboard data...</p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#b0b0b0",
                marginTop: "0.5rem",
              }}
            >
              This may take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid-container">
        <div
          style={{
            gridColumn: "span 12",
            padding: "2rem",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderRadius: "0.5rem",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            color: "#ff8a80",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>⚠️ Error Loading Dashboard</h3>
          <p style={{ marginBottom: "1rem" }}>{error}</p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#b0b0b0",
              marginBottom: "1rem",
            }}
          >
            Please check your internet connection and ensure the backend server
            is running.
          </p>
          <button
            onClick={fetchDashboardData}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--primary-purple)",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <StatCards stats={dashboardData.stats} />
      <TransactionGraph revenueData={dashboardData.trends.revenue} />
      <AttendanceChart attendanceData={dashboardData.trends.attendance} />
      <RecentActivityTable activities={dashboardData.recentActivity} />
    </div>
  );
};

export default DashboardHome;
