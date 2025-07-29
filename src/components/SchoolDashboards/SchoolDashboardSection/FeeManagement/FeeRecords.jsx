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
        setRecords(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch fee records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-records">
      <h2>Fee Records</h2>
      <FeeRecordFilter filters={filters} onChange={handleFilterChange} />
      <FeeRecordsTable records={records} />
    </div>
  );
};

export default FeeRecords;
