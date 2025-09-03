import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const DocumentTypeChart = ({ data }) => {
  // Process and validate data - handle the actual backend structure
  const processedData =
    data && Array.isArray(data)
      ? data
          .filter((item) => item && item.count > 0)
          .map((item) => ({
            type:
              item.category__name || item.type || item.name || "Uncategorized",
            count: item.count || 0,
          }))
          .sort((a, b) => b.count - a.count) // Sort by count descending
      : [];

  // Show message if no data
  if (!processedData || processedData.length === 0) {
    return (
      <div className="chart-wrapper">
        <div
          className="no-data-message"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          No document type data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="type"
            type="category"
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [value, "Documents"]}
            labelStyle={{ color: "#333" }}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#3498db"
            name="Document Count"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DocumentTypeChart;
