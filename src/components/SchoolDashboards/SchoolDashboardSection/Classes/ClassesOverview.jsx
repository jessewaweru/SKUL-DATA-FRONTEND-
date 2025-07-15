import { useEffect, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import ClassCard from "./ClassCard";
import { FiFilter, FiSearch } from "react-icons/fi";
import "./classes.css";

const ClassesOverview = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    grade_level: "",
    stream: "",
    academic_year: "",
  });
  const api = useApi();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.grade_level)
          params.append("grade_level", filters.grade_level);
        if (filters.stream) params.append("stream", filters.stream);
        if (filters.academic_year)
          params.append("academic_year", filters.academic_year);

        const response = await api.get(
          `/api/schools/classes/?${params.toString()}`
        );

        // Handle both paginated (results) and non-paginated responses
        const classesData = response.data.results || response.data;

        if (!Array.isArray(classesData)) {
          throw new Error("Unexpected response format: expected an array");
        }

        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", {
          error: error.response?.data || error.message,
          status: error.response?.status,
        });
        setError(error.message);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [filters]);

  return (
    <div className="classes-overview">
      <div className="classes-header">
        <h2>Classes Overview</h2>
        <div className="classes-actions">
          <div className="search-filter">
            <FiSearch />
            <input type="text" placeholder="Search classes..." />
          </div>
          <button className="filter-btn">
            <FiFilter />
            Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading classes...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : classes.length === 0 ? (
        <div>No classes found</div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classData={cls} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesOverview;
