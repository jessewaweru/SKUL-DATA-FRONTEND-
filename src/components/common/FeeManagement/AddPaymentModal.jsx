import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const AddPaymentModal = ({ onClose, onSubmit, error: parentError }) => {
  const api = useApi();
  const [formData, setFormData] = useState({
    fee_record_id: "",
    amount: "",
    payment_method: "mpesa",
    transaction_reference: "",
    receipt_number: "",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Load fee records for selection
  useEffect(() => {
    const fetchFeeRecords = async () => {
      try {
        setLoadingRecords(true);
        // Fetch unpaid and partially paid records
        const response = await api.get(
          "/api/fees/fee-records/?status=unpaid,partial"
        );

        let records = [];
        if (response.data.results) {
          records = response.data.results;
        } else if (Array.isArray(response.data)) {
          records = response.data;
        }

        // Filter for records with outstanding balance
        const outstandingRecords = records.filter(
          (record) => parseFloat(record.balance || 0) > 0
        );

        setFeeRecords(outstandingRecords);
      } catch (err) {
        console.error("Error fetching fee records:", err);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchFeeRecords();
  }, [api]);

  // Update selected record when fee_record_id changes
  useEffect(() => {
    if (formData.fee_record_id) {
      const record = feeRecords.find(
        (r) => r.id.toString() === formData.fee_record_id
      );
      setSelectedRecord(record);
    } else {
      setSelectedRecord(null);
    }
  }, [formData.fee_record_id, feeRecords]);

  // Use parent error if provided
  useEffect(() => {
    if (parentError) {
      setError(parentError);
    }
  }, [parentError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.fee_record_id) {
      setError("Please select a fee record");
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid payment amount");
      return false;
    }

    if (!formData.payment_method) {
      setError("Please select a payment method");
      return false;
    }

    // Check if payment amount exceeds outstanding balance
    if (selectedRecord) {
      const balance = parseFloat(selectedRecord.balance || 0);
      const amount = parseFloat(formData.amount);

      if (amount > balance) {
        setError(
          `Payment amount cannot exceed outstanding balance of KES ${balance.toFixed(
            2
          )}`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        fee_record: parseInt(formData.fee_record_id),
      };

      await onSubmit(paymentData);
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(err.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "KES 0.00";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-payment-modal">
        <div className="modal-header">
          <h3>Add Payment Record</h3>
          <button onClick={onClose} className="close-button" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="fee-error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="payment-form-group">
              <label htmlFor="fee_record_id">Fee Record *</label>
              {loadingRecords ? (
                <div className="loading-select">Loading fee records...</div>
              ) : (
                <select
                  id="fee_record_id"
                  name="fee_record_id"
                  value={formData.fee_record_id}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a fee record</option>
                  {feeRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.student?.full_name ||
                        record.student?.first_name +
                          " " +
                          record.student?.last_name}{" "}
                      -{record.fee_structure?.school_class?.name} -
                      {record.fee_structure?.term
                        ?.replace("_", " ")
                        .toUpperCase()}{" "}
                      {record.fee_structure?.year} - Balance:{" "}
                      {formatCurrency(record.balance)}
                    </option>
                  ))}
                </select>
              )}
              {selectedRecord && (
                <div className="selected-record-info">
                  <small>
                    Outstanding Balance:{" "}
                    <strong>{formatCurrency(selectedRecord.balance)}</strong>
                  </small>
                </div>
              )}
            </div>

            <div className="payment-form-group">
              <label htmlFor="amount">Payment Amount (KES) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                max={selectedRecord ? selectedRecord.balance : undefined}
                required
                className="form-input"
                placeholder="Enter payment amount"
              />
              {selectedRecord && (
                <small className="input-hint">
                  Maximum: {formatCurrency(selectedRecord.balance)}
                </small>
              )}
            </div>

            <div className="payment-form-group">
              <label htmlFor="payment_method">Payment Method *</label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="mpesa">M-PESA</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="payment-form-group">
              <label htmlFor="transaction_reference">
                Transaction Reference
              </label>
              <input
                type="text"
                id="transaction_reference"
                name="transaction_reference"
                value={formData.transaction_reference}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter transaction reference"
              />
            </div>

            <div className="payment-form-group">
              <label htmlFor="receipt_number">Receipt Number</label>
              <input
                type="text"
                id="receipt_number"
                name="receipt_number"
                value={formData.receipt_number}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter receipt number"
              />
            </div>

            <div className="payment-form-group">
              <label htmlFor="payment_date">Payment Date *</label>
              <input
                type="date"
                id="payment_date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
                className="form-input"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="payment-form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="form-textarea"
                placeholder="Enter any additional notes"
              />
            </div>

            <div className="payment-form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
