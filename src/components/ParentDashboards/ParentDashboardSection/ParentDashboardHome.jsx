import ParentStatCards from "./ParentStatCards";
import ParentRecentActivityTable from "./ParentRecentActivityTable";
import "../ParentDashboardSection/parentdashboard.css";

const ParentDashboardHome = () => {
  return (
    <div className="parent-grid-container">
      <ParentStatCards />
      <ParentRecentActivityTable />
    </div>
  );
};

export default ParentDashboardHome;
