import { FiCheckCircle } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const AttendanceChart = ({ attendanceData = [] }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "var(--card-background)",
            padding: "0.75rem",
            border: "1px solid var(--border-color)",
            borderRadius: "0.25rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p
            style={{
              color: "var(--text-color)",
              marginBottom: "0.25rem",
              fontWeight: "bold",
            }}
          >
            {label}
          </p>
          <p style={{ color: "#10b981", margin: 0 }}>
            Attendance: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate statistics
  const avgRate =
    attendanceData.length > 0
      ? (
          attendanceData.reduce((sum, item) => sum + item.rate, 0) /
          attendanceData.length
        ).toFixed(1)
      : 0;

  const maxRate =
    attendanceData.length > 0
      ? Math.max(...attendanceData.map((item) => item.rate)).toFixed(1)
      : 0;

  const minRate =
    attendanceData.length > 0
      ? Math.min(...attendanceData.map((item) => item.rate)).toFixed(1)
      : 0;

  return (
    <div className="radar-container">
      <div className="radar-header">
        <h3 className="radar-title">
          <FiCheckCircle />
          Attendance Trend
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#b0b0b0",
            marginTop: "0.25rem",
          }}
        >
          Monthly attendance rates (Last 12 months)
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            color: "var(--text-color)",
          }}
        >
          <span>
            Avg: <strong>{avgRate}%</strong>
          </span>
          <span>
            Max: <strong>{maxRate}%</strong>
          </span>
          <span>
            Min: <strong>{minRate}%</strong>
          </span>
        </div>
      </div>

      <div className="radar-content">
        {attendanceData && attendanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={attendanceData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorAttendance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="name"
                stroke="var(--accent-purple-light)"
                style={{ fontSize: "0.75rem" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--accent-purple-light)"
                style={{ fontSize: "0.75rem" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAttendance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-color)",
            }}
          >
            No attendance data available
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceChart;
