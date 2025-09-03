import { Outlet } from "react-router-dom";
import TeacherTable from "./TeacherTable";
import { fetchTeachers } from "../../../../services/teacherService";
import { useEffect, useState } from "react";
import "../Teachers/teachers.css";

const TeacherProfiles = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await fetchTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  return (
    <div className="teacher-profiles">
      <Outlet />
      {!location.pathname.includes("/create") &&
        !location.pathname.includes("/edit") && (
          <TeacherTable teachers={teachers} loading={loading} />
        )}
    </div>
  );
};

export default TeacherProfiles;
