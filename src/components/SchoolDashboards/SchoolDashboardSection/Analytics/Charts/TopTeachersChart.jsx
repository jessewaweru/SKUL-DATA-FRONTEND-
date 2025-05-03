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

const TopTeachersChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="logins" fill="#8884d8" name="Login Count" />
          <Bar dataKey="reports" fill="#82ca9d" name="Reports Submitted" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTeachersChart;
