import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const PaymentMethodSettings = () => {
  const api = useApi();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    account_number: "",
    account_name: "",
    instructions: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await api.get("/fee_management/payment-methods");
        setPaymentMethods(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch payment methods");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
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
      const response = await api.post(
        "/fee_management/payment-methods",
        formData
      );
      setPaymentMethods((prev) => [...prev, response.data]);
      setFormData({
        name: "",
        account_number: "",
        account_name: "",
        instructions: "",
        is_active: true,
      });
    } catch (err) {
      setError(err.message || "Failed to add payment method");
    } finally {
      setLoading(false);
    }
  };

  const toggleMethodStatus = async (id, isActive) => {
    try {
      await api.patch(`/fee_management/payment-methods/${id}`, {
        is_active: !isActive,
      });
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id ? { ...method, is_active: !isActive } : method
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update payment method");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="fee-error-message">{error}</div>;

  return (
    <div className="payment-method-settings">
      <h3>Payment Methods</h3>

      <form onSubmit={handleSubmit}>
        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Method Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payment-form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
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
            />
          </div>

          <div className="payment-form-group">
            <label>Active</label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="payment-form-group">
          <label>Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit">Add Payment Method</button>
      </form>

      <div className="methods-list">
        <table>
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
                <td>{method.name}</td>
                <td>{method.account_number}</td>
                <td>{method.account_name}</td>
                <td>
                  <span
                    className={`fee-status-badge ${
                      method.is_active ? "status-active" : "status-inactive"
                    }`}
                  >
                    {method.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      toggleMethodStatus(method.id, method.is_active)
                    }
                  >
                    {method.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMethodSettings;
