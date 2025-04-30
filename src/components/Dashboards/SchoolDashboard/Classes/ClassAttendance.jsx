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
import "../Classes/classes.css";

const ClassAttendanceSummary = ({ classId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const api = useApi();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [attendanceRes, statsRes] = await Promise.all([
          api.get(`/class-attendances/?school_class=${classId}`),
          api.get(`/classes/${classId}/attendance-stats/`),
        ]);

        setAttendanceData(attendanceRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [classId, timeRange]);

  const heatmapData = attendanceData.map((record) => ({
    date: record.date,
    count: record.present_students.length,
  }));

  const calculateTrend = (current, previous) => {
    if (previous === 0) return "no-change";
    const percentage = ((current - previous) / previous) * 100;
    return percentage >= 0 ? "up" : "down";
  };

  if (loading) return <div>Loading attendance data...</div>;

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
            {stats?.current_attendance_rate?.toFixed(1)}%
          </div>
          <div className="stat-label">
            <FiUsers /> Current Rate
          </div>
          {stats?.previous_attendance_rate && (
            <div
              className={`stat-trend ${calculateTrend(
                stats.current_attendance_rate,
                stats.previous_attendance_rate
              )}`}
            >
              {calculateTrend(
                stats.current_attendance_rate,
                stats.previous_attendance_rate
              ) === "up" ? (
                <FiTrendingUp />
              ) : (
                <FiTrendingDown />
              )}
              {Math.abs(
                ((stats.current_attendance_rate -
                  stats.previous_attendance_rate) /
                  stats.previous_attendance_rate) *
                  100
              ).toFixed(1)}
              %
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.best_day?.date || "N/A"}</div>
          <div className="stat-label">Best Day ({stats?.best_day?.rate}%)</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.worst_day?.date || "N/A"}</div>
          <div className="stat-label">
            Worst Day ({stats?.worst_day?.rate}%)
          </div>
        </div>
      </div>

      <div className="attendance-heatmap">
        <h3>Attendance Heatmap</h3>
        <CalendarHeatmap
          startDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            const percentage = (value.count / stats?.total_students) * 100;
            if (percentage >= 90) return "color-scale-4";
            if (percentage >= 75) return "color-scale-3";
            if (percentage >= 50) return "color-scale-2";
            return "color-scale-1";
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return {};
            return {
              "data-tip": `${value.date}: ${value.count} present (${Math.round(
                (value.count / stats?.total_students) * 100
              )}%)`,
            };
          }}
        />
      </div>

      <div className="recent-attendance">
        <h3>Recent Attendance Records</h3>
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
                <td>{record.present_students.length}</td>
                <td>
                  {stats?.total_students - record.present_students.length}
                </td>
                <td>
                  {(
                    (record.present_students.length / stats?.total_students) *
                    100
                  ).toFixed(1)}
                  %
                </td>
                <td>{record.taken_by?.full_name || "System"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassAttendanceSummary;
