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

const AttendanceByClassChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="class" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]} />
          <Legend />
          <Bar
            dataKey="rate"
            fill="#8e44ad"
            name="Attendance Rate"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceByClassChart;
