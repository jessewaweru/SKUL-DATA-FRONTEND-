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

const DocumentUploadsChart = ({ data }) => {
  // Process and validate data - handle the actual backend structure
  const processedData =
    data && Array.isArray(data)
      ? data
          .filter((item) => item && item.upload_count > 0)
          .map((item) => ({
            name:
              `${item.uploaded_by__first_name || ""} ${
                item.uploaded_by__last_name || ""
              }`.trim() ||
              item.name ||
              "Unknown User",
            uploads: item.upload_count || item.uploads || item.count || 0,
            userType: item.uploaded_by__user_type || "Unknown",
          }))
          .sort((a, b) => b.uploads - a.uploads) // Sort by uploads descending
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
          No upload data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [value, "Uploads"]}
            labelFormatter={(name) => {
              const user = processedData.find((item) => item.name === name);
              return `${name}${user?.userType ? ` (${user.userType})` : ""}`;
            }}
            labelStyle={{ color: "#333" }}
          />
          <Legend />
          <Bar
            dataKey="uploads"
            fill="#8884d8"
            name="Uploads"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DocumentUploadsChart;
