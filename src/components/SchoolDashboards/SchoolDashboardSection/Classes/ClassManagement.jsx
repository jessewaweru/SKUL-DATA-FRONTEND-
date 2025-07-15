import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import ClassList from "./ClassList";
import "../Classes/classes.css";
import { Outlet } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";

const ClassManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    grade_level: "",
    stream: "",
    academic_year: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await api.get(
          `/api/schools/classes/?${params.toString()}`
        );

        // Handle both paginated and non-paginated responses
        const classesData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]); // Ensure we always have an array
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [filters]);

  const isDetailView = location.pathname.match(/\/classes\/manage\/(new|\d+)/);

  return (
    <div className="class-management">
      {/* Outlet renders nested routes (ClassDetails or ClassCreateForm) */}
      <Outlet context={{ refreshClasses: () => setFilters({ ...filters }) }} />

      {/* Show list when not in detail view */}
      {!isDetailView && (
        <>
          <div className="management-header">
            <h2>Class Management</h2>
            <div className="management-actions">
              <div className="search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="create-btn"
                onClick={() => navigate("/classes/manage/new")}
              >
                <FiPlus /> Create New Class
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <select
              value={filters.grade_level}
              onChange={(e) =>
                setFilters({ ...filters, grade_level: e.target.value })
              }
            >
              <option value="">All Grades</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Grade 1">Grade 1</option>
              {/* Other grade options */}
            </select>

            <select
              value={filters.stream}
              onChange={(e) =>
                setFilters({ ...filters, stream: e.target.value })
              }
            >
              <option value="">All Streams</option>
              {/* Dynamically populated streams would go here */}
            </select>

            <select
              value={filters.academic_year}
              onChange={(e) =>
                setFilters({ ...filters, academic_year: e.target.value })
              }
            >
              <option value="">All Years</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>

            <select
              value={filters.is_active}
              onChange={(e) =>
                setFilters({ ...filters, is_active: e.target.value === "true" })
              }
            >
              <option value="true">Active</option>
              <option value="false">Archived</option>
            </select>
          </div>

          {loading ? (
            <div>Loading classes...</div>
          ) : (
            <ClassList
              classes={classes.filter(
                (cls) =>
                  cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  cls.room_number
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )}
              onClassSelect={(classId) =>
                navigate(`/classes/manage/${classId}`)
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default ClassManagement;
