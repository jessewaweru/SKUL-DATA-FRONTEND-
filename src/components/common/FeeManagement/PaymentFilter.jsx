import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const PaymentFilter = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      feeRecord: "",
      student: "",
      parent: "",
      method: "",
      confirmed: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="payment-filter">
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="fee-filter-group">
            <label htmlFor="feeRecord">Fee Record ID</label>
            <input
              type="text"
              id="feeRecord"
              name="feeRecord"
              value={localFilters.feeRecord}
              onChange={handleChange}
            />
          </div>

          <div className="fee-filter-group">
            <label htmlFor="student">Student ID</label>
            <input
              type="text"
              id="student"
              name="student"
              value={localFilters.student}
              onChange={handleChange}
            />
          </div>

          <div className="fee-filter-group">
            <label htmlFor="parent">Parent ID</label>
            <input
              type="text"
              id="parent"
              name="parent"
              value={localFilters.parent}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="fee-filter-group">
            <label htmlFor="method">Payment Method</label>
            <select
              id="method"
              name="method"
              value={localFilters.method}
              onChange={handleChange}
            >
              <option value="">All Methods</option>
              <option value="mpesa">M-PESA</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="fee-filter-group">
            <label htmlFor="confirmed">Confirmation Status</label>
            <select
              id="confirmed"
              name="confirmed"
              value={localFilters.confirmed}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="true">Confirmed</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <div className="fee-filter-group">
            <label htmlFor="startDate">From Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={localFilters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="fee-filter-group">
            <label htmlFor="endDate">To Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={localFilters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="fee-filter-actions">
          <button type="submit">Apply Filters</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentFilter;
