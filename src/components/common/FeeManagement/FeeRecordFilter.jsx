import { useState } from "react";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeRecordFilter = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setLocalFilters((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      class: "",
      term: "",
      year: "",
      status: "",
      overdue: false,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="fee-record-filter">
      <form onSubmit={handleSubmit}>
        <div className="fee-filter-group">
          <label htmlFor="class">Class</label>
          <select
            id="class"
            name="class"
            value={localFilters.class}
            onChange={handleChange}
          >
            <option value="">All Classes</option>
            {/* Options would be populated from API */}
          </select>
        </div>

        <div className="fee-filter-group">
          <label htmlFor="term">Term</label>
          <select
            id="term"
            name="term"
            value={localFilters.term}
            onChange={handleChange}
          >
            <option value="">All Terms</option>
            <option value="term_1">Term 1</option>
            <option value="term_2">Term 2</option>
            <option value="term_3">Term 3</option>
          </select>
        </div>

        <div className="fee-filter-group">
          <label htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            name="year"
            value={localFilters.year}
            onChange={handleChange}
            placeholder="YYYY"
          />
        </div>

        <div className="fee-filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={localFilters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="fee-filter-group checkbox-group">
          <input
            type="checkbox"
            id="overdue"
            name="overdue"
            checked={localFilters.overdue}
            onChange={handleChange}
          />
          <label htmlFor="overdue">Overdue Only</label>
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

export default FeeRecordFilter;
