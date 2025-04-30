import { Outlet } from "react-router-dom";
import AnalyticsHeader from "./AnalyticsHeader";
import "../Analytics/analytics.css";

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      <AnalyticsHeader />
      <div className="analytics-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AnalyticsPage;
