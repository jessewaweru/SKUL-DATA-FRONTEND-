import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const UserGrowthChart = ({ data }) => {
  // If no data or empty data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <div className="no-data">No user data available</div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="teachers"
            stroke="#8884d8"
            name="Teachers"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#82ca9d"
            name="Students"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="parents"
            stroke="#ffc658"
            name="Parents"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="admins"
            stroke="#ff7c7c"
            name="Admins"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
