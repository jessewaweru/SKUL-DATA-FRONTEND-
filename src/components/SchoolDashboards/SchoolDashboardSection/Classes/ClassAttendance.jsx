import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import "./classes.css";

const ClassAttendanceSummary = ({ classId }) => {
  const [stats, setStats] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    if (!classId) {
      console.error("No classId provided to ClassAttendanceSummary");
      setLoading(false);
      setError("No class ID provided");
      return;
    }

    const fetchAttendanceStats = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching attendance stats for class ID:", classId);

        // Use the new stats endpoint
        const response = await api.get(
          `/api/schools/class-attendances/stats_by_class/?class_id=${classId}`
        );

        console.log("Attendance stats response:", response.data);

        setStats(response.data);
        setRecentRecords(response.data.recent_records || []);
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to load attendance data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [classId]);

  if (loading) {
    return <div className="loading-spinner">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="no-data">No attendance data available</div>;
  }

  return (
    <div className="attendance-summary">
      <div className="attendance-header">
        <h2>
          <FiCalendar /> Attendance Summary
        </h2>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-value">
            {stats.average_attendance_rate?.toFixed(1) || 0}%
          </div>
          <div className="stat-label">
            <FiUsers /> Average Attendance Rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.total_students || 0}</div>
          <div className="stat-label">Total Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.total_records || 0}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>

      <div className="recent-attendance">
        <h3>Recent Attendance Records</h3>
        {recentRecords.length === 0 ? (
          <p>No attendance records found for this class.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Rate</th>
                <th>Taken By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.present_count}</td>
                  <td>{record.absent_count}</td>
                  <td>{record.attendance_rate.toFixed(1)}%</td>
                  <td>{record.taken_by}</td>
                  <td>{record.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClassAttendanceSummary;
