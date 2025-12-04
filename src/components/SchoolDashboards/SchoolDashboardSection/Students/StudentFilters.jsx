// components/SchoolDashboard/Students/StudentFilters.jsx
import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import "./students.css";

const StudentFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    class_name: "",
    status: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      class_name: "",
      status: "",
      search: "",
    });
    onFilter({});
  };

  return (
    <div className="student-filters">
      <div className="filter-search">
        <input
          type="text"
          name="search"
          placeholder="Search by name or ID..."
          value={filters.search}
          onChange={handleFilterChange}
          onKeyPress={(e) => e.key === "Enter" && applyFilters()}
        />
        <button onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> {showFilters ? "Hide Filters" : "More Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <label>
              Class:
              <select
                name="class_name"
                value={filters.class_name}
                onChange={handleFilterChange}
              >
                <option value="">All Classes</option>
                {/* Populate with actual classes */}
              </select>
            </label>

            <label>
              Status:
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="GRADUATED">Graduated</option>
                <option value="LEFT">Left</option>
              </select>
            </label>
          </div>

          <div className="filter-actions">
            <button onClick={resetFilters} className="reset-btn">
              <FiX /> Reset
            </button>
            <button onClick={applyFilters} className="apply-btn">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFilters;
