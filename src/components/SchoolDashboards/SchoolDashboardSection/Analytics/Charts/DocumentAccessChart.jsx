import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const DocumentAccessChart = ({ data }) => {
  // Process and validate data
  const processedData =
    data && Array.isArray(data)
      ? data
          .filter(
            (item) =>
              item &&
              (item.role || item.user_type || item.name) &&
              (item.count || item.value)
          )
          .map((item) => ({
            role: item.role || item.user_type || item.name || "Unknown",
            count: item.count || item.value || 0,
          }))
      : [];

  // Show message if no data
  if (!processedData || processedData.length === 0) {
    return (
      <div className="chart-wrapper">
        <div
          className="no-data-message"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#666",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          <p>No document access data available</p>
          <small>
            Document access tracking may not be enabled or no users have
            accessed documents yet.
          </small>
        </div>
      </div>
    );
  }

  // Calculate total for percentage calculation
  const total = processedData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ role, count, percent }) =>
              total > 0
                ? `${role}: ${(percent * 100).toFixed(1)}%`
                : `${role}: ${count}`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="role"
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} accesses`, name]}
            labelStyle={{ color: "#333" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DocumentAccessChart;
