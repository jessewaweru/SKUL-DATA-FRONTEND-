import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const RecentFeePayments = () => {
  const api = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const response = await api.get(
          "/api/fees/fee-payments?limit=5&ordering=-payment_date"
        );

        // Ensure we always set an array, even if response.data is null/undefined
        setPayments(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        setError(err.message || "Failed to fetch recent payments");
        setPayments([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPayments();
  }, []);

  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  if (loading) return <div className="loading">Loading recent payments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recent-payments">
      <h3>Recent Payments</h3>
      {!payments || payments.length === 0 ? (
        <p>No recent payments found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment?.payment_date)}</td>
                <td>{payment?.fee_record?.student?.full_name || "N/A"}</td>
                <td>{formatCurrency(payment?.amount)}</td>
                <td>{payment?.payment_method || "N/A"}</td>
                <td>
                  <span
                    className={`fee-status-badge ${
                      payment?.is_confirmed ? "status-paid" : "status-pending"
                    }`}
                  >
                    {payment?.is_confirmed ? "Confirmed" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentFeePayments;
