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
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchAttendanceData = async () => {
      if (!classId) {
        console.error("No classId provided to ClassAttendanceSummary");
        if (isMounted) {
          setLoading(false);
          setError("No class ID provided");
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        console.log("Fetching attendance for class ID:", classId);

        // Fixed API endpoints to match your backend URLs
        const attendanceRes = await api.get(
          `/api/schools/class-attendances/?school_class=${classId}`
        );

        console.log("Attendance response:", attendanceRes.data);

        if (isMounted) {
          const attendanceRecords =
            attendanceRes.data.results || attendanceRes.data || [];
          setAttendanceData(attendanceRecords);

          // Calculate stats from attendance data since the endpoint doesn't exist yet
          if (attendanceRecords.length > 0) {
            const calculatedStats = calculateAttendanceStats(attendanceRecords);
            setStats(calculatedStats);
          } else {
            setStats({
              current_attendance_rate: 0,
              total_students: 0,
              best_day: null,
              worst_day: null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        if (isMounted) {
          setError(
            error.response?.data?.detail ||
              error.message ||
              "Failed to load attendance data"
          );
          setAttendanceData([]);
          setStats(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAttendanceData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [classId, timeRange]); // Removed 'api' from dependencies

  // Helper function to calculate stats from attendance data
  const calculateAttendanceStats = (records) => {
    if (!records.length) return null;

    const totalStudents = records[0]?.total_students || 0;
    const attendanceRates = records.map((record) => ({
      date: record.date,
      rate:
        totalStudents > 0
          ? (record.present_students.length / totalStudents) * 100
          : 0,
    }));

    const currentRate =
      attendanceRates.length > 0 ? attendanceRates[0].rate : 0;
    const avgRate =
      attendanceRates.reduce((sum, r) => sum + r.rate, 0) /
      attendanceRates.length;

    const bestDay = attendanceRates.reduce(
      (best, current) => (current.rate > (best?.rate || 0) ? current : best),
      null
    );
    const worstDay = attendanceRates.reduce(
      (worst, current) =>
        current.rate < (worst?.rate || 100) ? current : worst,
      null
    );

    return {
      current_attendance_rate: avgRate,
      total_students: totalStudents,
      best_day: bestDay
        ? {
            date: new Date(bestDay.date).toLocaleDateString(),
            rate: Math.round(bestDay.rate),
          }
        : null,
      worst_day: worstDay
        ? {
            date: new Date(worstDay.date).toLocaleDateString(),
            rate: Math.round(worstDay.rate),
          }
        : null,
    };
  };

  const heatmapData = attendanceData.map((record) => ({
    date: record.date,
    count: record.present_students?.length || 0,
  }));

  const calculateTrend = (current, previous) => {
    if (previous === 0) return "no-change";
    const percentage = ((current - previous) / previous) * 100;
    return percentage >= 0 ? "up" : "down";
  };

  if (loading)
    return <div className="loading-spinner">Loading attendance data...</div>;

  if (error) return <div className="error-message">Error: {error}</div>;

  if (!stats)
    return <div className="no-data">No attendance data available</div>;

  return (
    <div className="attendance-summary">
      <div className="attendance-header">
        <h2>
          <FiCalendar /> Attendance Summary
        </h2>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="term">Current Term</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-value">
            {stats?.current_attendance_rate?.toFixed(1) || 0}%
          </div>
          <div className="stat-label">
            <FiUsers /> Average Rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.total_students || 0}</div>
          <div className="stat-label">Total Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.best_day?.date || "N/A"}</div>
          <div className="stat-label">
            Best Day ({stats?.best_day?.rate || 0}%)
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.worst_day?.date || "N/A"}</div>
          <div className="stat-label">
            Worst Day ({stats?.worst_day?.rate || 0}%)
          </div>
        </div>
      </div>

      {attendanceData.length > 0 && (
        <div className="attendance-heatmap">
          <h3>Attendance Heatmap</h3>
          <CalendarHeatmap
            startDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return "color-empty";
              const percentage =
                (value.count / (stats?.total_students || 1)) * 100;
              if (percentage >= 90) return "color-scale-4";
              if (percentage >= 75) return "color-scale-3";
              if (percentage >= 50) return "color-scale-2";
              return "color-scale-1";
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return {};
              return {
                "data-tip": `${value.date}: ${
                  value.count
                } present (${Math.round(
                  (value.count / (stats?.total_students || 1)) * 100
                )}%)`,
              };
            }}
          />
        </div>
      )}

      <div className="recent-attendance">
        <h3>Recent Attendance Records</h3>
        {attendanceData.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {attendanceData.slice(0, 5).map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.present_students?.length || 0}</td>
                  <td>
                    {(record.total_students || 0) -
                      (record.present_students?.length || 0)}
                  </td>
                  <td>
                    {record.total_students > 0
                      ? (
                          ((record.present_students?.length || 0) /
                            record.total_students) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </td>
                  <td>
                    {record.taken_by?.first_name || "System"}{" "}
                    {record.taken_by?.last_name || ""}
                  </td>
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
