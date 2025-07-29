import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const PaymentRecordsTable = ({ payments = [], onConfirm }) => {
  // Ensure payments is always an array
  const safePayments = Array.isArray(payments) ? payments : [];

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
    }).format(amount || 0); // Added fallback for undefined amount
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case "mpesa":
        return "M-PESA";
      case "bank":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      case "cheque":
        return "Cheque";
      default:
        return "Other";
    }
  };

  if (safePayments.length === 0) {
    return (
      <div className="payment-records-table">
        <p>No payment records found</p>
      </div>
    );
  }

  return (
    <div className="payment-records-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Parent</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safePayments.map((payment) => (
            <tr key={payment?.id || Math.random()}>
              <td>{formatDate(payment?.payment_date)}</td>
              <td>{payment?.fee_record?.student?.full_name || "N/A"}</td>
              <td>
                {payment?.fee_record?.parent?.user?.get_full_name() || "N/A"}
              </td>
              <td>{formatCurrency(payment?.amount)}</td>
              <td>{getMethodLabel(payment?.payment_method)}</td>
              <td>{payment?.transaction_reference || "N/A"}</td>
              <td>
                <span
                  className={`fee-status-badge ${
                    payment?.is_confirmed ? "status-paid" : "status-pending"
                  }`}
                >
                  {payment?.is_confirmed ? "Confirmed" : "Pending"}
                </span>
              </td>
              <td>
                {!payment?.is_confirmed && (
                  <button
                    onClick={() => onConfirm(payment?.id)}
                    className="confirm-button"
                    disabled={!payment?.id} // Disable if no ID
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentRecordsTable;
