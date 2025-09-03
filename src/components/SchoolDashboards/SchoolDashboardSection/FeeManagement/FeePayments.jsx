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
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });
  const [filters, setFilters] = useState({
    feeRecord: "",
    student: "",
    parent: "",
    method: "",
    confirmed: "",
    startDate: "",
    endDate: "",
    page: 1,
  });

  const fetchPayments = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", pageNumber.toString());

      // Add filters
      if (filters.feeRecord) params.append("fee_record_id", filters.feeRecord);
      if (filters.student) params.append("student_id", filters.student);
      if (filters.parent) params.append("parent_id", filters.parent);
      if (filters.method) params.append("payment_method", filters.method);
      if (filters.confirmed !== "")
        params.append("is_confirmed", filters.confirmed);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);

      console.log(
        "Fetching payments with URL:",
        `/api/fees/fee-payments/?${params.toString()}`
      );

      const response = await api.get(
        `/api/fees/fee-payments/?${params.toString()}`
      );

      console.log("Payment API Response:", response.data);

      // Handle both paginated and non-paginated responses
      if (response.data.results) {
        // Paginated response
        setPayments(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          currentPage: pageNumber,
        });
      } else if (Array.isArray(response.data)) {
        // Non-paginated array response
        setPayments(response.data);
        setPagination({
          count: response.data.length,
          next: null,
          previous: null,
          currentPage: 1,
        });
      } else {
        // Single object or unexpected format
        setPayments([]);
        setPagination({
          count: 0,
          next: null,
          previous: null,
          currentPage: 1,
        });
        console.warn("Unexpected API response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch payment records"
      );
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [
    filters.feeRecord,
    filters.student,
    filters.parent,
    filters.method,
    filters.confirmed,
    filters.startDate,
    filters.endDate,
  ]);

  const handleAddPayment = async (paymentData) => {
    try {
      setError(null);
      console.log("Submitting payment data:", paymentData);

      const response = await api.post("/api/fees/fee-payments/", paymentData);

      console.log("Payment creation response:", response.data);

      // Add the new payment to the beginning of the list
      setPayments((prev) => [response.data, ...prev]);
      setShowAddModal(false);

      // Show success message or notification
      console.log("Payment added successfully");
    } catch (err) {
      console.error("Error adding payment:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0] ||
        err.message ||
        "Failed to add payment";
      setError(errorMessage);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      setError(null);
      console.log("Confirming payment:", paymentId);

      await api.post(`/api/fees/fee-payments/${paymentId}/confirm/`);

      // Update the payment in the local state
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId
            ? { ...payment, is_confirmed: true }
            : payment
        )
      );

      console.log("Payment confirmed successfully");
    } catch (err) {
      console.error("Error confirming payment:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to confirm payment";
      setError(errorMessage);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPayments(newPage);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  if (loading) {
    return (
      <div className="fee-payments">
        <div className="loading-container">
          <div className="loading-spinner">Loading payment records...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-payments">
      <div className="payments-header">
        <div className="header-content">
          <div className="header-text">
            <h2>Fee Payments</h2>
            <p className="header-subtitle">
              Manage and track all fee payments ({pagination.count} total)
            </p>
          </div>
          <button
            className="add-payment-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add Payment
          </button>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button className="error-dismiss" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        </div>
      )}

      <PaymentFilter filters={filters} onChange={handleFilterChange} />

      <PaymentRecordsTable
        payments={payments}
        onConfirm={handleConfirmPayment}
      />

      {/* Pagination */}
      {pagination.count > 25 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {(pagination.currentPage - 1) * 25 + 1} to{" "}
            {Math.min(pagination.currentPage * 25, pagination.count)} of{" "}
            {pagination.count} payments
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.previous}
            >
              Previous
            </button>
            <span className="pagination-current">
              Page {pagination.currentPage}
            </span>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.next}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddPaymentModal
          onClose={() => {
            setShowAddModal(false);
            setError(null); // Clear any errors when closing modal
          }}
          onSubmit={handleAddPayment}
          error={error}
        />
      )}
    </div>
  );
};

export default FeePayments;
