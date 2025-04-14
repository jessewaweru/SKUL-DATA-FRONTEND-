import "../SchoolDashboard/dashboard.css";
import TopBar from "./TopBar";
// import DashboardHome from "./DashboardHome";
// import { useState } from "react";
import { Outlet } from "react-router-dom";

// const Dashboard = () => {
//   const [activeView, setActiveView] = useState("Dashboard");

//   return (
//     <div className="dashboard-container">
//       <TopBar />

//       {activeView === "Dashboard" && <DashboardHome />}
//       {activeView === "Users: Accounts" && <UserAccounts />}
//       {activeView === "Users: Roles" && <UserRoles />}
//       {activeView === "Users: Sessions" && <UserSessions />}
//     </div>
//   );
// };

// export default Dashboard;

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopBar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
