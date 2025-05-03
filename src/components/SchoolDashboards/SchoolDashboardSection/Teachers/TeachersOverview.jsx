// components/SchoolDashboard/Teachers/TeachersOverview.jsx
import { useEffect, useState } from "react";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import StatCard from "../../../common/StatCard/StatCard";
import TeacherTable from "./TeacherTable";
import { fetchTeachers } from "../../../../services/teacherService";
import "../Teachers/teachers.css";

const TeachersOverview = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    newThisYear: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTeachers();
        setTeachers(data);

        // Calculate stats
        const total = data.length;
        const active = data.filter((t) => t.status === "ACTIVE").length;
        const onLeave = data.filter((t) => t.status === "ON_LEAVE").length;
        const currentYear = new Date().getFullYear();
        const newThisYear = data.filter(
          (t) => new Date(t.hire_date).getFullYear() === currentYear
        ).length;

        setStats({ total, active, onLeave, newThisYear });
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
