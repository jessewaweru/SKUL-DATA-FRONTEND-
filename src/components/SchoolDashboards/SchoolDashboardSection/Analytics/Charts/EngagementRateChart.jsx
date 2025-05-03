import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const EngagementRateChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, "Engagement Rate"]} />
          <Legend />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#3498db"
            fill="#3498db"
            fillOpacity={0.2}
            name="Engagement Rate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementRateChart;
