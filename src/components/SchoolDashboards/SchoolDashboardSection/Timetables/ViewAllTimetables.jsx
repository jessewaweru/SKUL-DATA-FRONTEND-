import { useState, useEffect, useCallback } from "react";
import { useTimetableApi } from "../../../../hooks/useTimetableApi";
import useUser from "../../../../hooks/useUser";
import TimetableCard from "../../../common/SchoolTimetable/TimetableCard";
import "./timetables.css";

// ViewAllTimetables.jsx - Updated version
const ViewAllTimetables = () => {
  const { user } = useUser();
  const api = useTimetableApi();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    academicYear: "",
    term: "",
    isActive: false,
  });

  const fetchTimetables = useCallback(async () => {
    // Better school ID extraction
    const getSchoolId = () => {
      if (!user) return null;

      // Try multiple paths to get school ID
      return (
        user.school_id ||
        user.school?.id ||
        user.school_admin_profile?.school?.id ||
        user.administrator_profile?.school?.id ||
        user.roleSchool
      );
    };

    const schoolId = getSchoolId();

    if (!schoolId) {
      console.log("No school ID found. User object:", user);
      setError("School information not available");
      setTimetables([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching timetables for school ID:", schoolId);
      const response = await api.getTimetables(schoolId);

      console.log("Timetables API response:", response);

      let timetableData = [];
      if (response?.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          timetableData = response.data.results;
        } else if (Array.isArray(response.data)) {
          timetableData = response.data;
        } else if (typeof response.data === "object") {
          timetableData = [response.data];
        }
      }

      console.log("Processed timetables:", timetableData.length);
      setTimetables(timetableData);
    } catch (err) {
      console.error("Error fetching timetables:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to load timetables";
      setError(errorMessage);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  }, [user, api]);

  useEffect(() => {
    if (user) {
      fetchTimetables();
    }
  }, [user, fetchTimetables]);

  const filteredTimetables = Array.isArray(timetables)
    ? timetables.filter((timetable) => {
        const matchesYear =
          filter.academicYear === "" ||
          timetable?.academic_year?.includes(filter.academicYear);
        const matchesTerm =
          filter.term === "" || timetable?.term?.toString() === filter.term;
        const matchesActive = !filter.isActive || timetable?.is_active === true;

        return matchesYear && matchesTerm && matchesActive;
      })
    : [];

  const handleActivate = async (timetableId) => {
    try {
      await api.activateTimetable(timetableId);
      setTimetables((prevTimetables) =>
        prevTimetables.map((t) => ({
          ...t,
          is_active: t.id === timetableId ? true : false,
        }))
      );
    } catch (err) {
      console.error("Failed to activate timetable:", err);
      setError(
        "Failed to activate timetable: " + (err.message || "Unknown error")
      );
    }
  };

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  if (loading) {
    return <div className="loading">Loading timetables...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchTimetables}>Retry</button>
      </div>
    );
  }

  return (
    <div className="view-all-timetables">
      <div className="header">
        <h2>All Timetables</h2>
        <button onClick={fetchTimetables} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Academic Year:</label>
          <input
            type="text"
            placeholder="e.g. 2024"
            value={filter.academicYear}
            onChange={(e) =>
              setFilter({ ...filter, academicYear: e.target.value })
            }
          />
        </div>
        <div className="filter-group">
          <label>Term:</label>
          <select
            value={filter.term}
            onChange={(e) => setFilter({ ...filter, term: e.target.value })}
          >
            <option value="">All Terms</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
        </div>
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={filter.isActive}
              onChange={(e) =>
                setFilter({ ...filter, isActive: e.target.checked })
              }
            />
            Active Only
          </label>
        </div>
      </div>

      <div className="timetables-info">
        <p>
          Showing {filteredTimetables.length} of {timetables.length} timetables
        </p>
      </div>

      <div className="timetables-grid">
        {filteredTimetables.length === 0 ? (
          <div className="no-results">
            {timetables.length === 0
              ? "No timetables found. Create some timetables to get started."
              : "No timetables match the current filters."}
          </div>
        ) : (
          filteredTimetables.map((timetable) => (
            <TimetableCard
              key={timetable.id}
              timetable={timetable}
              onActivate={handleActivate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAllTimetables;
