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

const FeedbackChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="positive"
            fill="#2ecc71"
            name="Positive Feedback"
            stackId="a"
          />
          <Bar
            dataKey="neutral"
            fill="#f39c12"
            name="Neutral Feedback"
            stackId="a"
          />
          <Bar
            dataKey="negative"
            fill="#e74c3c"
            name="Negative Feedback"
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackChart;
