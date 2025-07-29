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
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeePaymentStatusChart = ({ data }) => {
  // Transform data for the chart
  const chartData = [
    {
      name: "Paid",
      value: data.fully_paid_count,
    },
    {
      name: "Partial",
      value: data.partially_paid_count,
    },
    {
      name: "Unpaid",
      value: data.unpaid_count,
    },
    {
      name: "Overdue",
      value: data.overdue_count,
    },
  ];

  return (
    <div className="fee-chart-wrapper">
      <h3>Payment Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeePaymentStatusChart;
