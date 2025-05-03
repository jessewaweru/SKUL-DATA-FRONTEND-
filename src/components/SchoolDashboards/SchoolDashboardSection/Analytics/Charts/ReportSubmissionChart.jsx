import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const ReportSubmissionChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="expected" name="Expected" unit="reports" />
          <YAxis dataKey="submitted" name="Submitted" unit="reports" />
          <ZAxis dataKey="teacher" name="Teacher" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter name="Report Compliance" data={data} fill="#3498db" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportSubmissionChart;
