import { Outlet } from "react-router-dom";
import SchedulerSidebar from "./SchedulerSidebar";
import "../Scheduler/scheduler.css";

const SchedulerPage = () => {
  return (
    <div className="scheduler-container">
      <SchedulerSidebar />
      <div className="scheduler-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SchedulerPage;
