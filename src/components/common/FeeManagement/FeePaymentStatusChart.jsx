import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell, // Add this import
} from "recharts";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeePaymentStatusChart = ({ data }) => {
  // Handle null/undefined data
  if (!data) {
    return (
      <div className="fee-chart-wrapper">
        <h3>Payment Status Distribution</h3>
        <div className="no-data">No payment status data available</div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = [
    {
      name: "Fully Paid",
      count: parseInt(data.fully_paid_count || 0),
      color: "#4CAF50",
    },
    {
      name: "Partially Paid",
      count: parseInt(data.partially_paid_count || 0),
      color: "#FF9800",
    },
    {
      name: "Unpaid",
      count: parseInt(data.unpaid_count || 0),
      color: "#F44336",
    },
    {
      name: "Overdue",
      count: parseInt(data.overdue_count || 0),
      color: "#9C27B0",
    },
  ];

  // Calculate total for percentage calculations
  const totalStudents = chartData.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : 0;

      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="value">Count: {data.value} students</p>
          <p className="percentage">({percentage}% of total)</p>
        </div>
      );
    }
    return null;
  };

  // Check if there's any data to display
  if (totalStudents === 0) {
    return (
      <div className="fee-chart-wrapper">
        <h3>Payment Status Distribution</h3>
        <div className="no-data">No student payment data available</div>
      </div>
    );
  }

  return (
    <div className="fee-chart-wrapper">
      <h3>Payment Status Distribution</h3>
      <div className="chart-stats">
        <span className="total-students">{totalStudents} Total Students</span>
        <div className="status-summary">
          {chartData.map((item, index) => (
            <span
              key={index}
              className={`status-item status-${item.name
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {item.name}: {item.count}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "Number of Students",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeePaymentStatusChart;
