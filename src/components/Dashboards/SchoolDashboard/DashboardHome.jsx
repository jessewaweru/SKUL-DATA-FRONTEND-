import StatCards from "./StatCards";
import TransactionGraph from "./TransactionGraph";
import UsageRadarChart from "./UsageRadarChart";
import RecentActivityTable from "./RecentActivityTable";

const DashboardHome = () => {
  return (
    <div className="grid-container">
      <StatCards />
      <TransactionGraph />
      <UsageRadarChart />
      <RecentActivityTable />
    </div>
  );
};

export default DashboardHome;
