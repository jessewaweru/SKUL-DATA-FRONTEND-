import { useState } from "react";
import ParentTopBar from "./ParentTopBar";
import ParentDashboardHome from "./ParentDashboardHome";
import "../ParentDashboardSection/parentdashboard.css";

const ParentDashboard = () => {
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="parent-dashboard-container">
      <ParentTopBar />

      {activeView === "Dashboard" && <ParentDashboardHome />}
      {/* We'll add other views here as we build them */}
    </div>
  );
};

export default ParentDashboard;
