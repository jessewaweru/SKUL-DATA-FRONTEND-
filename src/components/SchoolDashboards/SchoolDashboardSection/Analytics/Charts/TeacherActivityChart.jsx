import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const TeacherActivityChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#3498db" />
          <YAxis yAxisId="right" orientation="right" stroke="#e74c3c" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="logins"
            barSize={20}
            fill="#3498db"
            name="Logins (Weekly)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="reports"
            stroke="#e74c3c"
            name="Reports Submitted"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeacherActivityChart;
