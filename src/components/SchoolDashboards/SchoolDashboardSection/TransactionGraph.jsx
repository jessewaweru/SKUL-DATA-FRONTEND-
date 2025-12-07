import { FiDollarSign } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import "../SchoolDashboardSection/dashboard.css";

const TransactionGraph = ({ revenueData = [] }) => {
  // Format revenue for display
  const formatRevenue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

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
          <p style={{ color: "#3b82f6", margin: 0 }}>
            Revenue: Ksh {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h3 className="graph-title">
          <FiDollarSign />
          Revenue Trend
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#b0b0b0",
            marginTop: "0.25rem",
          }}
        >
          Monthly school fee collections (Last 12 months)
        </p>
      </div>

      <div className="graph-content">
        {revenueData && revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
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
                tickFormatter={formatRevenue}
                stroke="var(--accent-purple-light)"
                style={{ fontSize: "0.75rem" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="#3b82f6"
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
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
            No revenue data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionGraph;
