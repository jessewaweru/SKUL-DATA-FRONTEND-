import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeClassReport = () => {
  const api = useApi();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedClass) params.append("class_id", selectedClass);

        const response = await api.get(
          `/api/fees/fee-records/summary?${params.toString()}`
        );
        setReportData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch class report");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedClass]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="fee-error-message">{error}</div>;

  return (
    <div className="fee-class-report">
      <h3>Class Fee Report</h3>
      <div className="fee-class-selector">
        <label>Select Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {/* Options would be populated from API */}
        </select>
      </div>

      {reportData && reportData.length > 0 && (
        <div className="fee-report-content">
          <h4>{reportData[0].school_class.name} Fee Summary</h4>
          <div className="fee-class-stats">
            <div className="fee-stat-item">
              <span>Total Students:</span>
              <strong>{reportData[0].total_students}</strong>
            </div>
            <div className="fee-stat-item">
              <span>Expected Revenue:</span>
              <strong>{formatCurrency(reportData[0].total_expected)}</strong>
            </div>
            <div className="fee-stat-item">
              <span>Amount Paid:</span>
              <strong>{formatCurrency(reportData[0].total_paid)}</strong>
            </div>
            <div className="fee-stat-item">
              <span>Balance:</span>
              <strong>{formatCurrency(reportData[0].total_balance)}</strong>
            </div>
            <div className="fee-stat-item">
              <span>Payment Rate:</span>
              <strong>{reportData[0].paid_percentage.toFixed(2)}%</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Parent</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData[0].fee_records.map((record) => (
                <tr key={record.id}>
                  <td>{record.student.full_name}</td>
                  <td>{record.parent.user.get_full_name}</td>
                  <td>{formatCurrency(record.amount_owed)}</td>
                  <td>{formatCurrency(record.amount_paid)}</td>
                  <td>{formatCurrency(record.balance)}</td>
                  <td>
                    <span className={`status-badge ${record.payment_status}`}>
                      {record.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeeClassReport;
