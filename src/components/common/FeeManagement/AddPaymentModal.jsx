import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const AddPaymentModal = ({ onClose, onSubmit }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fee_record_id ||
      !formData.amount ||
      !formData.payment_method
    ) {
      setError("Required fields are missing");
      return;
    }

    if (isNaN(parseFloat(formData.amount))) {
      setError("Amount must be a number");
      return;
    }

    setError(null);
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="add-payment-modal">
        <div className="modal-header">
          <h3>Add Payment</h3>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        {error && <div className="fee-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="payment-form-group">
            <label>Fee Record ID</label>
            <input
              type="text"
              name="fee_record_id"
              value={formData.fee_record_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payment-form-group">
            <label>Amount (KES)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="payment-form-group">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="mpesa">M-PESA</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="payment-form-group">
            <label>Transaction Reference</label>
            <input
              type="text"
              name="transaction_reference"
              value={formData.transaction_reference}
              onChange={handleChange}
            />
          </div>

          <div className="payment-form-group">
            <label>Receipt Number</label>
            <input
              type="text"
              name="receipt_number"
              value={formData.receipt_number}
              onChange={handleChange}
            />
          </div>

          <div className="payment-form-group">
            <label>Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payment-form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="payment-form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Add Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
