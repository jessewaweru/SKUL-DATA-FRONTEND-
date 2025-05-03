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

const ResponseTimeChart = ({ data }) => {
  // Convert response times from seconds to hours for display
  const formattedData = data?.map((item) => ({
    ...item,
    responseTime: item.responseTime / 3600, // Convert seconds to hours
  }));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="teacher" />
          <YAxis
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => [`${value} hours`, "Response Time"]} />
          <Legend />
          <Bar
            dataKey="responseTime"
            fill="#e74c3c"
            name="Avg. Response Time"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
