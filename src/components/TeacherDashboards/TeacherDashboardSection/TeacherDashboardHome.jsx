import TeacherStatCards from "./TeacherStatCards";
import TeacherRecentActivity from "./TeacherRecentActivity";
import "../TeacherDashboardSection/teacherdashboard.css";

const TeacherDashboardHome = () => {
  return (
    <div className="teacher-grid-container">
      <TeacherStatCards />
      <TeacherRecentActivity />
    </div>
  );
};

export default TeacherDashboardHome;
