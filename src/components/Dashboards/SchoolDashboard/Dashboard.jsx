import "../SchoolDashboard/dashboard.css";
import TopBar from "./TopBar";
import Grid from "./Grid";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopBar />
      <Grid />
    </div>
  );
};

export default Dashboard;
