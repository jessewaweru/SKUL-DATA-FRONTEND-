import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeClassDistributionChart = ({ data }) => {
  // Handle null/undefined data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="fee-chart-wrapper">
        <h3>Fee Distribution by Class</h3>
        <div className="no-data">No fee data available for chart display</div>
      </div>
    );
  }

  // Group data by class name and aggregate amounts
  const classData = {};
  data.forEach((item) => {
    const className = item?.school_class?.name || "Unknown Class";
    const expectedAmount = parseFloat(item?.total_expected || 0);

    if (classData[className]) {
      classData[className] += expectedAmount;
    } else {
      classData[className] = expectedAmount;
    }
  });

  // Transform aggregated data for the chart
  const chartData = Object.entries(classData)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .filter((item) => item.value > 0) // Only show classes with fees
    .sort((a, b) => b.value - a.value); // Sort by value descending

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
    "#8DD1E1",
    "#D084D0",
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="label">{data.name}</p>
          <p className="value">Amount: {formatCurrency(data.value)}</p>
          <p className="percentage">
            (
            {(
              (data.value /
                chartData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            %)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="fee-chart-wrapper">
        <h3>Fee Distribution by Class</h3>
        <div className="no-data">No fee data available for classes</div>
      </div>
    );
  }

  return (
    <div className="fee-chart-wrapper">
      <h3>Fee Distribution by Class</h3>
      <div className="chart-stats">
        <span className="total-classes">{chartData.length} Classes</span>
        <span className="total-amount">
          Total:{" "}
          {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              percent > 5 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} ({formatCurrency(entry.payload.value)})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeeClassDistributionChart;
