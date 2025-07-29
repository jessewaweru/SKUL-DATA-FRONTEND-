import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeDefaulterReport = () => {
  const api = useApi();
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    class: "",
    term: "",
    year: "",
  });

  useEffect(() => {
    const fetchDefaulters = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("status", "unpaid");
        if (filters.class) params.append("class_id", filters.class);
        if (filters.term) params.append("term", filters.term);
        if (filters.year) params.append("year", filters.year);

        const response = await api.get(
          `/api/fees/fee-records?${params.toString()}`
        );
        setDefaulters(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch defaulter report");
      } finally {
        setLoading(false);
      }
    };

    fetchDefaulters();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="fee-error-message">{error}</div>;

  return (
    <div className="fee-defaulter-report">
      <h3>Fee Defaulter Report</h3>
      <div className="fee-report-filters">
        <div className="fee-filter-group">
          <label>Class:</label>
          <select
            name="class"
            value={filters.class}
            onChange={handleFilterChange}
          >
            <option value="">All Classes</option>
            {/* Options would be populated from API */}
          </select>
        </div>
        <div className="fee-filter-group">
          <label>Term:</label>
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
          >
            <option value="">All Terms</option>
            <option value="term_1">Term 1</option>
            <option value="term_2">Term 2</option>
            <option value="term_3">Term 3</option>
          </select>
        </div>
        <div className="fee-filter-group">
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="YYYY"
          />
        </div>
      </div>

      <div className="fee-report-content">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Parent</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Amount Due</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((defaulter) => (
              <tr key={defaulter.id}>
                <td>{defaulter.student.full_name}</td>
                <td>{defaulter.fee_structure.school_class.name}</td>
                <td>{defaulter.parent.user.get_full_name}</td>
                <td>{defaulter.parent.phone_number}</td>
                <td>{defaulter.parent.user.email}</td>
                <td>{formatCurrency(defaulter.amount_owed)}</td>
                <td>{new Date(defaulter.due_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDefaulterReport;
