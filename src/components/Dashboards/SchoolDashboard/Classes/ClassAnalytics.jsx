import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../Classes/classes.css";

const COLORS = ["#8e4d91", "#5a1b5d", "#bb86fc", "#f0e6f1", "#3d0f41"];

const ClassAnalytics = () => {
  const { classId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("term");
  const api = useApi();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(
          `/classes/${classId}/analytics/?time_range=${timeRange}`
        );
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [classId, timeRange]);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No analytics data available</div>;

  const performanceData = [
    { name: "0-39%", value: analytics.performance_distribution.f },
    { name: "40-49%", value: analytics.performance_distribution.e },
    { name: "50-59%", value: analytics.performance_distribution.d },
    { name: "60-69%", value: analytics.performance_distribution.c },
    { name: "70-79%", value: analytics.performance_distribution.b },
    { name: "80-100%", value: analytics.performance_distribution.a },
  ];

  return (
    <div className="class-analytics-page">
      <div className="analytics-header">
        <h2>
          <FiBarChart2 /> Class Analytics
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-selector"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="term">Current Term</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-value">
            {analytics.average_performance.toFixed(1)}%
          </div>
          <div className="summary-label">
            <FiBarChart2 /> Class Average
          </div>
          <div
            className={`summary-trend ${
              analytics.performance_trend === "up" ? "up" : "down"
            }`}
          >
            {analytics.performance_trend === "up" ? (
              <FiTrendingUp />
            ) : (
              <FiTrendingDown />
            )}
            {Math.abs(analytics.performance_change)}%
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analytics.attendance_rate.toFixed(1)}%
          </div>
          <div className="summary-label">
            <FiUsers /> Attendance Rate
          </div>
          <div
            className={`summary-trend ${
              analytics.attendance_trend === "up" ? "up" : "down"
            }`}
          >
            {analytics.attendance_trend === "up" ? (
              <FiTrendingUp />
            ) : (
              <FiTrendingDown />
            )}
            {Math.abs(analytics.attendance_change)}%
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analytics.top_student?.name || "N/A"}
          </div>
          <div className="summary-label">
            <FiAward /> Top Performer
          </div>
          <div className="summary-detail">
            {analytics.top_student?.score.toFixed(1) || "--"}%
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "A (80-100%)",
                  value: analytics.performance_distribution.a,
                },
                {
                  name: "B (70-79%)",
                  value: analytics.performance_distribution.b,
                },
                {
                  name: "C (60-69%)",
                  value: analytics.performance_distribution.c,
                },
                {
                  name: "D (50-59%)",
                  value: analytics.performance_distribution.d,
                },
                {
                  name: "E (40-49%)",
                  value: analytics.performance_distribution.e,
                },
                {
                  name: "F (0-39%)",
                  value: analytics.performance_distribution.f,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8e4d91" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {performanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-details">
        <div className="detail-section">
          <h3>Subject Performance</h3>
          <table className="subject-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Average</th>
                <th>Top Student</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {analytics.subject_performance.map((subject) => (
                <tr key={subject.name}>
                  <td>{subject.name}</td>
                  <td>{subject.average_score.toFixed(1)}%</td>
                  <td>{subject.top_student?.name || "N/A"}</td>
                  <td>{subject.top_student?.score.toFixed(1) || "--"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h3>Attendance Trends</h3>
          <div className="attendance-trends">
            {analytics.attendance_by_month.map((month) => (
              <div key={month.month} className="trend-item">
                <div className="trend-month">{month.month}</div>
                <div className="trend-bar">
                  <div
                    className="trend-fill"
                    style={{ width: `${month.attendance_rate}%` }}
                  />
                </div>
                <div className="trend-value">
                  {month.attendance_rate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;
