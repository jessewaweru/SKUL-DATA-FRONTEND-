import { Outlet } from "react-router-dom";
import "../Reports/reports.css";

const ReportsPage = () => {
  return (
    <div className="reports-page-container">
      <Outlet />
    </div>
  );
};

export default ReportsPage;
