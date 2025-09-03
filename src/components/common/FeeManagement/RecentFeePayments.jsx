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

        // Handle paginated response structure
        let paymentsData = [];
        if (response?.data?.results) {
          // Paginated response
          paymentsData = response.data.results;
        } else if (Array.isArray(response?.data)) {
          // Direct array response
          paymentsData = response.data;
        }

        setPayments(paymentsData);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to fetch recent payments");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPayments();
  }, []);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(numAmount);
  };

  const getPaymentMethodDisplay = (method) => {
    const methodMap = {
      mpesa: "M-PESA",
      bank: "Bank Transfer",
      cash: "Cash",
      cheque: "Cheque",
      other: "Other",
    };
    return methodMap[method?.toLowerCase()] || method || "N/A";
  };

  if (loading) {
    return (
      <div className="recent-payments">
        <h3>Recent Payments</h3>
        <div className="loading">Loading recent payments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-payments">
        <h3>Recent Payments</h3>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="recent-payments">
      <div className="recent-payments-header">
        <h3>Recent Payments</h3>
        <span className="payment-count">({payments.length} payments)</span>
      </div>

      {!payments || payments.length === 0 ? (
        <div className="no-payments">
          <p>No recent payments found</p>
        </div>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.id || index}>
                  <td className="payment-date">
                    {formatDate(payment?.payment_date)}
                  </td>
                  <td className="student-name">
                    {payment?.fee_record?.student?.full_name ||
                      payment?.fee_record?.student?.name ||
                      "N/A"}
                  </td>
                  <td className="payment-amount">
                    <strong>{formatCurrency(payment?.amount)}</strong>
                  </td>
                  <td className="payment-method">
                    {getPaymentMethodDisplay(payment?.payment_method)}
                  </td>
                  <td className="transaction-ref">
                    {payment?.transaction_reference ||
                      payment?.receipt_number ||
                      "N/A"}
                  </td>
                  <td className="payment-status">
                    <span
                      className={`status-badge ${
                        payment?.is_confirmed
                          ? "status-confirmed"
                          : "status-pending"
                      }`}
                    >
                      {payment?.is_confirmed ? "Confirmed" : "Pending"}
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

export default RecentFeePayments;
