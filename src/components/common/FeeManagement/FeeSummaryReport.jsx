import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeSummaryReport = () => {
  const api = useApi();
  const [reportData, setReportData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    term: "",
    year: "",
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.term) params.append("term", filters.term);
        if (filters.year) params.append("year", filters.year);

        const response = await api.get(
          `/api/fees/fee-records/summary?${params.toString()}`
        );
        // Ensure we always set an array and format percentages
        setReportData(
          Array.isArray(response?.data)
            ? response.data.map((item) => ({
                ...item,
                paid_percentage: Number(item.paid_percentage) || 0,
              }))
            : []
        );
      } catch (err) {
        setError(err.message || "Failed to fetch summary report");
        setReportData([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  const formatPercentage = (percent) => {
    return typeof percent === "number" ? percent.toFixed(2) + "%" : "0.00%";
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="fee-error-message">{error}</div>;

  return (
    <div className="fee-summary-report">
      <div className="fee-report-filters">
        <h3>Fee Summary Report</h3>
        <div className="fee-filter-group">
          <label>Term:</label>
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
          >
            <option value="">All Terms</option>
            <option value="term_1">Term 1</option>
            <option value="term_2">Term 2</option>
            <option value="term_3">Term 3</option>
          </select>
        </div>
        <div className="fee-filter-group">
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="YYYY"
          />
        </div>
      </div>

      <div className="fee-report-content">
        {reportData.length === 0 ? (
          <p>No fee records found for the selected filters</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Term/Year</th>
                <th>Class</th>
                <th>Total Students</th>
                <th>Expected Revenue</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Payment Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item?.term || "N/A"} {item?.year || "N/A"}
                  </td>
                  <td>{item?.school_class?.name || "N/A"}</td>
                  <td>{item?.total_students || 0}</td>
                  <td>{formatCurrency(item?.total_expected)}</td>
                  <td>{formatCurrency(item?.total_paid)}</td>
                  <td>{formatCurrency(item?.total_balance)}</td>
                  <td>{formatPercentage(item?.paid_percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FeeSummaryReport;
