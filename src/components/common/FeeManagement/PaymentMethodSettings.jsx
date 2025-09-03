import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const PaymentMethodSettings = () => {
  const api = useApi();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    account_number: "",
    account_name: "",
    instructions: "",
    is_active: true,
  });

  // Since you don't have a dedicated payment methods model/endpoint,
  // let's create a static list that can be managed in the frontend
  // and potentially stored in localStorage or a different way
  const defaultPaymentMethods = [
    {
      id: 1,
      name: "M-PESA",
      account_number: "174379", // Business number
      account_name: "Membley Mixed School",
      instructions:
        "Use student admission number as account reference. SMS confirmation will be sent.",
      is_active: true,
    },
    {
      id: 2,
      name: "Bank Transfer",
      account_number: "0123456789",
      account_name: "Membley Mixed School",
      instructions:
        "Please include student name and class in the transfer details.",
      is_active: true,
    },
    {
      id: 3,
      name: "Cash Payment",
      account_number: "N/A",
      account_name: "School Bursar",
      instructions:
        "Cash payments accepted at the school bursar's office during business hours (8AM - 4PM).",
      is_active: true,
    },
    {
      id: 4,
      name: "Cheque",
      account_number: "N/A",
      account_name: "Membley Mixed School",
      instructions:
        "Make cheques payable to 'Membley Mixed School'. Allow 3-5 business days for processing.",
      is_active: false,
    },
  ];

  useEffect(() => {
    // For now, we'll use static data since there's no dedicated payment methods endpoint
    // In a real scenario, you might want to store this in the school settings or create a new model
    const initializePaymentMethods = () => {
      try {
        // Try to get from localStorage first
        const savedMethods = localStorage.getItem("payment_methods");
        if (savedMethods) {
          setPaymentMethods(JSON.parse(savedMethods));
        } else {
          setPaymentMethods(defaultPaymentMethods);
          localStorage.setItem(
            "payment_methods",
            JSON.stringify(defaultPaymentMethods)
          );
        }
      } catch (err) {
        console.error("Error loading payment methods:", err);
        setPaymentMethods(defaultPaymentMethods);
        setError("Error loading saved payment methods, using defaults");
      } finally {
        setLoading(false);
      }
    };

    initializePaymentMethods();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const newMethod = {
        ...formData,
        id: editingMethod
          ? editingMethod.id
          : Math.max(...paymentMethods.map((m) => m.id), 0) + 1,
      };

      let updatedMethods;
      if (editingMethod) {
        // Update existing method
        updatedMethods = paymentMethods.map((method) =>
          method.id === editingMethod.id ? newMethod : method
        );
      } else {
        // Add new method
        updatedMethods = [...paymentMethods, newMethod];
      }

      setPaymentMethods(updatedMethods);
      localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));

      // Reset form
      setFormData({
        name: "",
        account_number: "",
        account_name: "",
        instructions: "",
        is_active: true,
      });
      setEditingMethod(null);
    } catch (err) {
      console.error("Error saving payment method:", err);
      setError(err.message || "Failed to save payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      account_number: method.account_number,
      account_name: method.account_name,
      instructions: method.instructions,
      is_active: method.is_active,
    });
  };

  const handleCancelEdit = () => {
    setEditingMethod(null);
    setFormData({
      name: "",
      account_number: "",
      account_name: "",
      instructions: "",
      is_active: true,
    });
  };

  const toggleMethodStatus = async (id, isActive) => {
    try {
      const updatedMethods = paymentMethods.map((method) =>
        method.id === id ? { ...method, is_active: !isActive } : method
      );

      setPaymentMethods(updatedMethods);
      localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));
    } catch (err) {
      console.error("Error updating payment method status:", err);
      setError(err.message || "Failed to update payment method status");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        const updatedMethods = paymentMethods.filter(
          (method) => method.id !== id
        );
        setPaymentMethods(updatedMethods);
        localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));
      } catch (err) {
        console.error("Error deleting payment method:", err);
        setError(err.message || "Failed to delete payment method");
      }
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset to default payment methods? This will overwrite your current settings."
      )
    ) {
      setPaymentMethods(defaultPaymentMethods);
      localStorage.setItem(
        "payment_methods",
        JSON.stringify(defaultPaymentMethods)
      );
      handleCancelEdit();
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading payment methods...</div>;

  return (
    <div className="payment-method-settings">
      <div className="payment-methods-header">
        <h3>Payment Methods Configuration</h3>
        <p className="payment-methods-description">
          Configure the payment methods available for fee collection. These will
          be shown to parents when making payments.
        </p>
        <button onClick={handleReset} className="reset-btn">
          Reset to Defaults
        </button>
      </div>

      {error && (
        <div className="fee-error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="payment-method-form">
        <h4>
          {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
        </h4>

        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Method Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., M-PESA, Bank Transfer"
            />
          </div>

          <div className="payment-form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Account number or paybill number"
            />
          </div>
        </div>

        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Account Name</label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              placeholder="Account holder name"
            />
          </div>

          <div className="payment-form-group payment-status-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active (shown to parents)
            </label>
          </div>
        </div>

        <div className="payment-form-group">
          <label>Payment Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="3"
            placeholder="Instructions for parents on how to use this payment method"
          />
        </div>

        <div className="payment-form-actions">
          <button type="submit" className="submit-btn">
            {editingMethod ? "Update Payment Method" : "Add Payment Method"}
          </button>
          {editingMethod && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="methods-list">
        <h4>Configured Payment Methods ({paymentMethods.length})</h4>

        {paymentMethods.length === 0 ? (
          <div className="no-methods-message">
            <p>
              No payment methods configured. Add your first payment method
              above.
            </p>
          </div>
        ) : (
          <div className="methods-table-container">
            <table className="methods-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account Number</th>
                  <th>Account Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((method) => (
                  <tr key={method.id}>
                    <td>
                      <strong>{method.name}</strong>
                    </td>
                    <td>{method.account_number || "N/A"}</td>
                    <td>{method.account_name || "N/A"}</td>
                    <td>
                      <span
                        className={`fee-status-badge ${
                          method.is_active ? "status-active" : "status-inactive"
                        }`}
                      >
                        {method.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="method-actions">
                      <button
                        onClick={() => handleEdit(method)}
                        className="edit-btn"
                        title="Edit method"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          toggleMethodStatus(method.id, method.is_active)
                        }
                        className={`toggle-btn ${
                          method.is_active ? "deactivate" : "activate"
                        }`}
                        title={method.is_active ? "Deactivate" : "Activate"}
                      >
                        {method.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="delete-btn"
                        title="Delete method"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="payment-methods-info">
        <h4>Payment Method Usage in System</h4>
        <div className="usage-info">
          <p>
            <strong>Active methods</strong> will be shown to parents when making
            fee payments.
          </p>
          <p>
            <strong>Inactive methods</strong> are hidden but preserved in the
            system for historical records.
          </p>
          <p>
            The payment methods configured here correspond to the choices
            available in fee payment records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSettings;
