import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "../../Analytics/analytics.css";

const ParentAccessChart = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <div className="no-data-message">No parent access data available</div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="report" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" fill="#9b59b6" name="Parent Actions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParentAccessChart;
