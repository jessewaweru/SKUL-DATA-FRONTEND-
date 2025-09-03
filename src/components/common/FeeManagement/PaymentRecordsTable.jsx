import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const PaymentRecordsTable = ({ payments = [], onConfirm }) => {
  const api = useApi();
  const [enrichedPayments, setEnrichedPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Enrich payment data with student and parent details
  useEffect(() => {
    const enrichPaymentData = async () => {
      if (!payments || payments.length === 0) {
        setEnrichedPayments([]);
        return;
      }

      setLoading(true);
      try {
        const enrichedData = await Promise.all(
          payments.map(async (payment) => {
            try {
              // Fetch fee record details if fee_record is just an ID
              let feeRecord = payment.fee_record;
              if (
                typeof payment.fee_record === "number" ||
                typeof payment.fee_record === "string"
              ) {
                const response = await api.get(
                  `/api/fees/fee-records/${payment.fee_record}/`
                );
                feeRecord = response.data;
              }

              return {
                ...payment,
                fee_record: feeRecord,
                student_name:
                  feeRecord?.student?.full_name ||
                  feeRecord?.student?.first_name +
                    " " +
                    feeRecord?.student?.last_name ||
                  "N/A",
                parent_name:
                  feeRecord?.parent?.user?.first_name +
                    " " +
                    feeRecord?.parent?.user?.last_name ||
                  feeRecord?.parent?.full_name ||
                  "N/A",
                student_admission:
                  feeRecord?.student?.admission_number || "N/A",
                class_name:
                  feeRecord?.fee_structure?.school_class?.name || "N/A",
                term: feeRecord?.fee_structure?.term || "N/A",
                year: feeRecord?.fee_structure?.year || "N/A",
              };
            } catch (error) {
              console.error("Error enriching payment:", payment.id, error);
              return {
                ...payment,
                student_name: "Error loading",
                parent_name: "Error loading",
                student_admission: "N/A",
                class_name: "N/A",
                term: "N/A",
                year: "N/A",
              };
            }
          })
        );

        setEnrichedPayments(enrichedData);
      } catch (error) {
        console.error("Error enriching payment data:", error);
        setEnrichedPayments(payments);
      } finally {
        setLoading(false);
      }
    };

    enrichPaymentData();
  }, [payments, api]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
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
    if (!amount) return "KES 0.00";
    try {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(parseFloat(amount));
    } catch {
      return `KES ${amount || 0}`;
    }
  };

  const getMethodLabel = (method) => {
    const methods = {
      mpesa: "M-PESA",
      bank: "Bank Transfer",
      cash: "Cash",
      cheque: "Cheque",
      other: "Other",
    };
    return methods[method?.toLowerCase()] || method || "Other";
  };

  const getStatusBadge = (isConfirmed) => {
    return (
      <span
        className={`fee-status-badge ${
          isConfirmed ? "status-paid" : "status-pending"
        }`}
      >
        {isConfirmed ? "Confirmed" : "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="payment-records-table">
        <div className="loading-spinner">Loading payment details...</div>
      </div>
    );
  }

  if (!enrichedPayments || enrichedPayments.length === 0) {
    return (
      <div className="payment-records-table">
        <div className="empty-state">
          <p>No payment records found</p>
          <p className="empty-state-subtitle">
            Payment records will appear here once payments are made.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-records-table">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Payment Date</th>
              <th>Student</th>
              <th>Admission No.</th>
              <th>Parent</th>
              <th>Class</th>
              <th>Term/Year</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrichedPayments.map((payment) => (
              <tr key={payment?.id || Math.random()}>
                <td>{formatDate(payment?.payment_date)}</td>
                <td>
                  <div className="student-info">
                    <div className="student-name">{payment?.student_name}</div>
                  </div>
                </td>
                <td>
                  <span className="admission-number">
                    {payment?.student_admission}
                  </span>
                </td>
                <td>
                  <div className="parent-info">
                    <div className="parent-name">{payment?.parent_name}</div>
                  </div>
                </td>
                <td>
                  <span className="class-name">{payment?.class_name}</span>
                </td>
                <td>
                  <div className="term-year">
                    <span>
                      {payment?.term?.replace("_", " ").toUpperCase()}{" "}
                      {payment?.year}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="amount">
                    {formatCurrency(payment?.amount)}
                  </span>
                </td>
                <td>
                  <span className="payment-method">
                    {getMethodLabel(payment?.payment_method)}
                  </span>
                </td>
                <td>
                  <span className="transaction-ref">
                    {payment?.transaction_reference || "N/A"}
                  </span>
                </td>
                <td>{getStatusBadge(payment?.is_confirmed)}</td>
                <td>
                  <div className="action-buttons">
                    {!payment?.is_confirmed && payment?.id && (
                      <button
                        onClick={() => onConfirm(payment.id)}
                        className="confirm-button"
                        title="Confirm Payment"
                      >
                        Confirm
                      </button>
                    )}
                    {payment?.is_confirmed && (
                      <span className="confirmed-text">✓ Confirmed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentRecordsTable;
