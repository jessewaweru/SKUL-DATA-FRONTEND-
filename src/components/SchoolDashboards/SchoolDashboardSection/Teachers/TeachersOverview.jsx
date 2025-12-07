import { useEffect, useState } from "react";
import TeacherTable from "./TeacherTable";
import {
  fetchSchoolTeachersDirect,
  fetchTeachers,
} from "../../../../services/teacherService";
import StatCard from "../../../common/StatCard/StatCard";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import useUser from "../../../../hooks/useUser";
import "./teachers.css";

const TeachersOverview = () => {
  const { user, schoolId } = useUser();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    newThisYear: 0,
  });

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Loading teachers with schoolId:", schoolId);

        // Check if user/school exists
        if (!schoolId) {
          throw new Error(
            "School ID not available. Please check your user profile."
          );
        }

        // Try the direct API call to /api/users/teachers/ first
        let teachersData = [];
        try {
          console.log("Attempting to fetch teachers from /api/users/teachers/");
          teachersData = await fetchTeachers(schoolId);
          console.log("Teachers data received:", teachersData);
        } catch (directError) {
          console.warn(
            "Direct fetch failed, trying alternative method:",
            directError
          );

          // Fallback to the alternative method if needed
          try {
            teachersData = await fetchSchoolTeachersDirect(schoolId);
            console.log("Alternative fetch successful:", teachersData);
          } catch (altError) {
            console.error("Both fetch methods failed:", altError);
            throw altError;
          }
        }

        setTeachers(teachersData);

        // Calculate stats
        const currentYear = new Date().getFullYear();
        const statsData = {
          total: teachersData.length,
          active: teachersData.filter((t) => t.status === "ACTIVE").length,
          onLeave: teachersData.filter((t) => t.status === "ON_LEAVE").length,
          newThisYear: teachersData.filter((t) => {
            if (!t.hire_date) return false;
            const hireYear = new Date(t.hire_date).getFullYear();
            return hireYear === currentYear;
          }).length,
        };

        console.log("Calculated stats:", statsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load teachers:", err);
        setError(err.message || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    // Only load if we have a school ID and it's not already loading
    if (schoolId && !loading) {
      loadTeachers();
    } else if (!schoolId && user) {
      // If we have a user but no school ID, show a more specific error
      setError("Unable to determine school. Please contact support.");
      setLoading(false);
    }
  }, [schoolId]); // Only depend on schoolId, not the entire user object

  if (loading) return <div>Loading teachers (please wait)...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="teachers-overview">
      <div className="stats-grid">
        <StatCard
          title="Total Teachers"
          value={stats.total}
          icon={<FiUser />}
          color="purple"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={<FiUser />}
          color="green"
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={<FiCalendar />}
          color="orange"
        />
        <StatCard
          title="New This Year"
          value={stats.newThisYear}
          icon={<FiClock />}
          color="blue"
        />
      </div>

      <div className="teachers-table-container">
        <TeacherTable teachers={teachers} loading={loading} />
      </div>
    </div>
  );
};

export default TeachersOverview;
