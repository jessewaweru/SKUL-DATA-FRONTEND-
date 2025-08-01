import { useEffect, useState } from "react";
import TeacherTable from "./TeacherTable";
import { fetchSchoolTeachersDirect } from "../../../../services/teacherService";
import StatCard from "../../../common/StatCard/StatCard";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import useUser from "../../../../hooks/useUser"; // Import useUser hook

const TeachersOverview = () => {
  const { user } = useUser(); // Get user from context
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

        // Check if user/school exists
        if (!user || !user.school) {
          throw new Error("User school information not available");
        }

        const teachers = await fetchSchoolTeachersDirect(user.school.id);
        setTeachers(teachers);

        // Calculate stats
        const currentYear = new Date().getFullYear();
        const statsData = {
          total: teachers.length,
          active: teachers.filter((t) => t.status === "ACTIVE").length,
          onLeave: teachers.filter((t) => t.status === "ON_LEAVE").length,
          newThisYear: teachers.filter((t) => {
            const hireYear = new Date(t.hire_date).getFullYear();
            return hireYear === currentYear;
          }).length,
        };
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load teachers:", err);
        setError(err.message || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    if (user?.school?.id) {
      loadTeachers();
    }
  }, [user]);

  if (loading) return <div>Loading teachers (please wait)...</div>;
  if (error) return <div className="error">{error}</div>;

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

// import { useEffect, useState } from "react";
// import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
// import StatCard from "../../../common/StatCard/StatCard";
// import TeacherTable from "./TeacherTable";
// import "../Teachers/teachers.css";
// import { useApi } from "../../../../hooks/useApi";
// import useUser from "../../../../hooks/useUser";

// const TeachersOverview = () => {
//   const { user } = useUser();
//   const api = useApi();
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     onLeave: 0,
//     newThisYear: 0,
//   });
//   const [error, setError] = useState(null);

//   // Add this before the useEffect
//   const [schoolId, setSchoolId] = useState(null);

//   // Add this effect to fetch school ID separately
//   useEffect(() => {
//     const fetchSchoolId = async () => {
//       try {
//         const response = await api.get(`/users/${user.id}/`);
//         const schoolId =
//           response.data.school_admin_profile?.school?.id ||
//           response.data.school_id;

//         if (schoolId) {
//           localStorage.setItem("currentSchoolId", schoolId);
//           setSchoolId(schoolId);
//         }
//       } catch (err) {
//         console.error("Failed to fetch school ID:", err);
//       }
//     };

//     if (user?.id && !schoolId) {
//       fetchSchoolId();
//     }
//   }, [user]);

//   return (
//     <div className="teachers-overview">
//       <div className="stats-grid">
//         <StatCard
//           title="Total Teachers"
//           value={stats.total}
//           icon={<FiUser />}
//           color="purple"
//         />
//         <StatCard
//           title="Active"
//           value={stats.active}
//           icon={<FiUser />}
//           color="green"
//         />
//         <StatCard
//           title="On Leave"
//           value={stats.onLeave}
//           icon={<FiCalendar />}
//           color="orange"
//         />
//         <StatCard
//           title="New This Year"
//           value={stats.newThisYear}
//           icon={<FiClock />}
//           color="blue"
//         />
//       </div>

//       <div className="teachers-table-container">
//         <TeacherTable teachers={teachers} loading={loading} />
//       </div>
//     </div>
//   );
// };

// export default TeachersOverview;

// import { useEffect, useState } from "react";
// import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
// import StatCard from "../../../common/StatCard/StatCard";
// import TeacherTable from "./TeacherTable";
// import { fetchTeachers } from "../../../../services/teacherService";
// import "../Teachers/teachers.css";
// import useUser from "../../../../hooks/useUser";
// import { useNavigate } from "react-router-dom";

// const TeachersOverview = () => {
//   const { user } = useUser();
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     onLeave: 0,
//     newThisYear: 0,
//   });
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!user) {
//           console.log("Waiting for user data...");
//           return;
//         }

//         console.log("Current user object:", user);

//         // Get school ID from user's profile (consistent with TimetableSetupStep1)
//         const schoolId =
//           user?.school_admin_profile?.school?.id ||
//           user?.administrator_profile?.school?.id ||
//           user?.teacher_profile?.school?.id ||
//           localStorage.getItem("current_school_id");

//         if (!schoolId) {
//           console.error("School context not available");
//           setError("Your school profile is not properly configured");
//           return;
//         }

//         console.log("Fetching teachers for school ID:", schoolId);
//         const teachersData = await fetchTeachers(schoolId);
//         setTeachers(teachersData);

//         // Calculate stats
//         const total = teachersData.length;
//         const active = teachersData.filter((t) => t.status === "ACTIVE").length;
//         const onLeave = teachersData.filter(
//           (t) => t.status === "ON_LEAVE"
//         ).length;
//         const currentYear = new Date().getFullYear();
//         const newThisYear = teachersData.filter(
//           (t) =>
//             t.hire_date && new Date(t.hire_date).getFullYear() === currentYear
//         ).length;

//         setStats({ total, active, onLeave, newThisYear });
//       } catch (error) {
//         console.error("Failed to load teachers:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       loadData();
//     }
//   }, [user, navigate]);

//   return (
//     <div className="teachers-overview">
//       <div className="stats-grid">
//         <StatCard
//           title="Total Teachers"
//           value={stats.total}
//           icon={<FiUser />}
//           color="purple"
//         />
//         <StatCard
//           title="Active"
//           value={stats.active}
//           icon={<FiUser />}
//           color="green"
//         />
//         <StatCard
//           title="On Leave"
//           value={stats.onLeave}
//           icon={<FiCalendar />}
//           color="orange"
//         />
//         <StatCard
//           title="New This Year"
//           value={stats.newThisYear}
//           icon={<FiClock />}
//           color="blue"
//         />
//       </div>

//       {error ? (
//         <div className="error-message">
//           {error.includes("configured") ? (
//             <>
//               {error}
//               <button
//                 onClick={() => navigate("/profile")}
//                 className="retry-btn"
//               >
//                 Update Profile
//               </button>
//             </>
//           ) : (
//             <>
//               Error loading teachers: {error}
//               <button
//                 onClick={() => window.location.reload()}
//                 className="retry-btn"
//               >
//                 Retry
//               </button>
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="teachers-table-container">
//           <TeacherTable teachers={teachers} loading={loading} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeachersOverview;
