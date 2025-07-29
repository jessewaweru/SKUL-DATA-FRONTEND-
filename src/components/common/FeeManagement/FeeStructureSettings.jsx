import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeStructureSettings = ({
  structures = [], // Default to empty array
  onAdd,
  onUpdate,
  onDelete,
}) => {
  // Ensure structures is always an array
  const safeStructures = Array.isArray(structures) ? structures : [];

  const [formData, setFormData] = useState({
    school_class_id: "",
    term: "",
    year: "",
    amount: "",
    due_date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.school_class_id ||
      !formData.term ||
      !formData.year ||
      !formData.amount ||
      !formData.due_date
    ) {
      setError("All fields are required");
      return;
    }

    if (isNaN(parseFloat(formData.amount))) {
      setError("Amount must be a number");
      return;
    }

    setError(null);

    const structureData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (editingId) {
      onUpdate(editingId, structureData);
    } else {
      onAdd(structureData);
    }

    // Reset form
    setFormData({
      school_class_id: "",
      term: "",
      year: "",
      amount: "",
      due_date: "",
    });
    setEditingId(null);
  };

  const handleEdit = (structure) => {
    if (!structure) return;

    setFormData({
      school_class_id: structure?.school_class?.id || "",
      term: structure?.term || "",
      year: structure?.year || "",
      amount: structure?.amount?.toString() || "",
      due_date: structure?.due_date || "",
    });
    setEditingId(structure?.id || null);
  };

  const handleCancelEdit = () => {
    setFormData({
      school_class_id: "",
      term: "",
      year: "",
      amount: "",
      due_date: "",
    });
    setEditingId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="fee-structure-settings">
      <h3>Fee Structures</h3>

      {error && <div className="fee-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Class</label>
            <select
              name="school_class_id"
              value={formData.school_class_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {/* Options would be populated from API */}
            </select>
          </div>

          <div className="payment-form-group">
            <label>Term</label>
            <select
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
            >
              <option value="">Select Term</option>
              <option value="term_1">Term 1</option>
              <option value="term_2">Term 2</option>
              <option value="term_3">Term 3</option>
            </select>
          </div>
        </div>

        <div className="fee-form-row">
          <div className="payment-form-group">
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="YYYY"
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
        </div>

        <div className="payment-form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fee-form-actions">
          {editingId ? (
            <>
              <button type="submit">Update Structure</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button type="submit">Add Structure</button>
          )}
        </div>
      </form>

      <div className="structures-list">
        {safeStructures.length === 0 ? (
          <p>No fee structures found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Term</th>
                <th>Year</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeStructures.map((structure) => (
                <tr key={structure?.id || Math.random()}>
                  <td>{structure?.school_class?.name || "N/A"}</td>
                  <td>{structure?.get_term_display?.() || "N/A"}</td>
                  <td>{structure?.year || "N/A"}</td>
                  <td>{formatCurrency(structure?.amount)}</td>
                  <td>{formatDate(structure?.due_date)}</td>
                  <td>
                    <button onClick={() => handleEdit(structure)}>Edit</button>
                    <button
                      onClick={() => structure?.id && onDelete(structure.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FeeStructureSettings;
