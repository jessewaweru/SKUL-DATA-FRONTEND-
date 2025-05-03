import { useState } from "react";
import TeacherTopBar from "./TeacherTopBar";
import TeacherStatCards from "./TeacherStatCards";
import TeacherRecentActivity from "./TeacherRecentActivity";
import "../TeacherDashboardSection/teacherdashboard.css";

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="teacher-dashboard-container">
      <TeacherTopBar />

      <main className="teacher-dashboard-home">
        {activeView === "Dashboard" && (
          <div className="teacher-grid-container">
            <TeacherStatCards />
            <TeacherRecentActivity />
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
