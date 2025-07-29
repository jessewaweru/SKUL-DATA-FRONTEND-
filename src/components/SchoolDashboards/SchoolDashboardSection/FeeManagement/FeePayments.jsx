import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import PaymentRecordsTable from "../../../common/FeeManagement/PaymentRecordsTable";
import PaymentFilter from "../../../common/FeeManagement/PaymentFilter";
import AddPaymentModal from "../../../common/FeeManagement/AddPaymentModal";
import "./feemanagement.css";

const FeePayments = () => {
  const api = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    feeRecord: "",
    student: "",
    parent: "",
    method: "",
    confirmed: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.feeRecord)
          params.append("fee_record_id", filters.feeRecord);
        if (filters.student) params.append("student_id", filters.student);
        if (filters.parent) params.append("parent_id", filters.parent);
        if (filters.method) params.append("payment_method", filters.method);
        if (filters.confirmed) params.append("is_confirmed", filters.confirmed);
        if (filters.startDate) params.append("start_date", filters.startDate);
        if (filters.endDate) params.append("end_date", filters.endDate);

        const response = await api.get(
          `/api/fees/fee-payments?${params.toString()}`
        );
        setPayments(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch payment records");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters]);

  const handleAddPayment = async (paymentData) => {
    try {
      const response = await api.post("/api/fees/fee-payments", paymentData);
      setPayments((prev) => [response.data, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || "Failed to add payment");
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await api.post(`/api/fees/fee-payments/${paymentId}/confirm`);
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId
            ? { ...payment, is_confirmed: true }
            : payment
        )
      );
    } catch (err) {
      setError(err.message || "Failed to confirm payment");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-payments">
      <div className="payments-header">
        <h2>Fee Payments</h2>
        <button onClick={() => setShowAddModal(true)}>Add Payment</button>
      </div>

      <PaymentFilter filters={filters} onChange={setFilters} />
      <PaymentRecordsTable
        payments={payments}
        onConfirm={handleConfirmPayment}
      />

      {showAddModal && (
        <AddPaymentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPayment}
        />
      )}
    </div>
  );
};

export default FeePayments;
