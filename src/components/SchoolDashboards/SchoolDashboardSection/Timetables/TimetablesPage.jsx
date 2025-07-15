import { Outlet } from "react-router-dom";
import useUser from "../../../../hooks/useUser";
import "./timetables.css";

const TimetablesPage = () => {
  const { user } = useUser();

  return (
    <div className="timetables-container">
      <div className="timetables-header">
        <h1>School Timetables Management</h1>
        <p>Manage all timetable-related activities for {user?.school?.name}</p>
      </div>
      <div className="timetables-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TimetablesPage;
