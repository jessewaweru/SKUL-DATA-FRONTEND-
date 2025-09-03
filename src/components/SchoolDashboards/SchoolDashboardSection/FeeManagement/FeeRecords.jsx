import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import FeeRecordsTable from "../../../common/FeeManagement/FeeRecordsTable";
import FeeRecordFilter from "../../../common/FeeManagement/FeeRecordFilter";
import "./feemanagement.css";

const FeeRecords = () => {
  const api = useApi();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 1,
  });
  const [filters, setFilters] = useState({
    class: "",
    term: "",
    year: "",
    status: "",
    overdue: false,
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.class) params.append("class_id", filters.class);
        if (filters.term) params.append("term", filters.term);
        if (filters.year) params.append("year", filters.year);
        if (filters.status) params.append("status", filters.status);
        if (filters.overdue) params.append("overdue", "true");

        const response = await api.get(
          `/api/fees/fee-records?${params.toString()}`
        );

        // Handle paginated response
        if (response.data && response.data.results) {
          setRecords(response.data.results);
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            current_page: 1, // You can calculate this from the URL if needed
            total_pages: Math.ceil(response.data.count / 25), // Assuming 25 per page
          });
        } else {
          // Handle non-paginated response (fallback)
          setRecords(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching fee records:", err);
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to fetch fee records"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [filters, api]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const loadMore = async (url) => {
    if (!url) return;

    try {
      const response = await api.get(
        url.replace("http://localhost:8000/api/", "/api/")
      );
      if (response.data && response.data.results) {
        setRecords(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          current_page:
            pagination.current_page + (url === pagination.next ? 1 : -1),
          total_pages: Math.ceil(response.data.count / 25),
        });
      }
    } catch (err) {
      console.error("Error loading page:", err);
      setError("Failed to load page");
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading fee records...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="fee-records">
      <h2>Fee Records ({pagination.count} total)</h2>
      <FeeRecordFilter filters={filters} onChange={handleFilterChange} />
      <FeeRecordsTable records={records} />

      {/* Pagination Controls */}
      {(pagination.previous || pagination.next) && (
        <div className="pagination-controls">
          <button
            onClick={() => loadMore(pagination.previous)}
            disabled={!pagination.previous}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => loadMore(pagination.next)}
            disabled={!pagination.next}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeeRecords;
