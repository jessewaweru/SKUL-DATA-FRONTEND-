import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiArrowLeft,
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
import { useNavigate } from "react-router-dom";
import ClassAttendanceSummary from "./ClassAttendance";

const COLORS = ["#8e4d91", "#5a1b5d", "#bb86fc", "#f0e6f1", "#3d0f41"];

const ClassAnalytics = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("term");
  const api = useApi();

  useEffect(() => {
    if (!classId) {
      setError("No class ID provided");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/api/schools/classes/${classId}/analytics/`
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        // Ensure all required fields are present
        const requiredFields = [
          "average_performance",
          "attendance_rate",
          "performance_distribution",
          "subject_performance",
          "attendance_by_month",
        ];

        for (const field of requiredFields) {
          if (!(field in response.data)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }

        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError(error.message || "Failed to load analytics data");

        // Set default empty analytics to prevent UI crashes
        setAnalytics({
          class_id: classId,
          class_name: "Class Analytics",
          average_performance: 0,
          attendance_rate: 0,
          performance_distribution: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
          subject_performance: [],
          attendance_by_month: [],
          performance_trend: "up",
          performance_change: 0,
          attendance_trend: "up",
          attendance_change: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [classId, timeRange, api]);

  if (!classId) {
    return (
      <div className="class-analytics-page error-page">
        <div className="error-message">
          <h2>Class Not Specified</h2>
          <p>Please select a class to view analytics.</p>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/classes")}
          >
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="class-analytics-page loading-page">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="class-analytics-page error-page">
        <div className="error-message">
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          {analytics && (
            <div className="warning-message">
              <p>Showing placeholder data due to error</p>
            </div>
          )}
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/classes")}
          >
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="class-analytics-page error-page">
        <div className="error-message">
          <h2>No Analytics Data</h2>
          <p>No analytics data available for this class.</p>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/classes")}
          >
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const performanceData = [
    { name: "0-39%", value: analytics.performance_distribution.f || 0 },
    { name: "40-49%", value: analytics.performance_distribution.e || 0 },
    { name: "50-59%", value: analytics.performance_distribution.d || 0 },
    { name: "60-69%", value: analytics.performance_distribution.c || 0 },
    { name: "70-79%", value: analytics.performance_distribution.b || 0 },
    { name: "80-100%", value: analytics.performance_distribution.a || 0 },
  ];

  return (
    <div className="class-analytics-page">
      <div className="analytics-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/classes")}
        >
          <FiArrowLeft /> Back to Classes
        </button>

        <h2>
          <FiBarChart2 /> {analytics.class_name} Analytics
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
        <div className="classes-summary-card">
          <div className="classes-summary-value">
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

        <div className="classes-summary-card">
          <div className="classes-summary-value">
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

        <div className="classes-summary-card">
          <div className="classes-summary-value">
            {analytics.top_student?.name || "N/A"}
          </div>
          <div className="summary-label">
            <FiAward /> Top Performer
          </div>
          <div className="summary-detail">
            {analytics.top_student?.score?.toFixed(1) || "--"}%
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
          {analytics.subject_performance.length > 0 ? (
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
                    <td>{subject.average_score?.toFixed(1) || 0}%</td>
                    <td>{subject.top_student?.name || "N/A"}</td>
                    <td>{subject.top_student?.score?.toFixed(1) || "--"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No subject performance data available</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Attendance Trends</h3>
          {analytics.attendance_by_month.length > 0 ? (
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
          ) : (
            <p>No attendance data available</p>
          )}
        </div>
      </div>
      {/* Add attendance summary here */}
      <div className="attendance-summary-section">
        <h3>Detailed Attendance Summary</h3>
        <ClassAttendanceSummary classId={classId} />
      </div>
    </div>
  );
};

export default ClassAnalytics;
