// src/components/SchoolDashboard/Reports/ReportAnalytics.jsx
import React, { useState, useEffect } from "react";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
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
import { useApi } from "../../../../hooks/useApi";
import "../Reports/reports.css";

const ReportAnalytics = () => {
  const api = useApi();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    report_type: "",
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.report_type)
        params.append("report_type", filters.report_type);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);

      const response = await api.get(
        `/api/reports/analytics/?${params.toString()}`
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const prepareChartData = () => {
    // Group by report type
    const byType = analyticsData.reduce((acc, report) => {
      const type = report.report_type.template_type;
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
      return acc;
    }, {});

    return Object.entries(byType).map(([type, count]) => ({
      name: type,
      count,
    }));
  };

  const prepareUsageData = () => {
    // Group by month
    const byMonth = analyticsData.reduce((acc, report) => {
      const date = new Date(report.generated_at);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    return Object.entries(byMonth)
      .map(([month, count]) => ({
        name: month,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Report Analytics</h2>
        <div className="analytics-filters">
          <div className="filter-group">
            <label>
              <FiFilter /> Report Type:
            </label>
            <select
              value={filters.report_type}
              onChange={(e) =>
                handleFilterChange("report_type", e.target.value)
              }
            >
              <option value="">All Types</option>
              <option value="ACADEMIC">Academic</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="PAYROLL">Payroll</option>
              <option value="ENROLLMENT">Enrollment</option>
            </select>
          </div>

          <div className="filter-group">
            <label>From:</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To:</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={fetchAnalytics}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading analytics...</div>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Reports Generated</h3>
              <p className="stat-value">{analyticsData.length}</p>
            </div>

            <div className="analytics-card">
              <h3>Most Active User</h3>
              <p className="stat-value">
                {analyticsData.reduce((acc, report) => {
                  const user = report.generated_by?.username || "System";
                  if (!acc[user]) acc[user] = 0;
                  acc[user]++;
                  return acc;
                }, {})}
              </p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Reports by Type</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3498db" name="Number of Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Report Generation Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={prepareUsageData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8e44ad" name="Reports per Month" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportAnalytics;
