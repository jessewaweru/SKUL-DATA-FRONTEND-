import "../SchoolDashboardSection/dashboard.css";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopBar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
