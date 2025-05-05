import { Outlet } from "react-router-dom";
import SchedulerSidebar from "./SchedulerSidebar";
import "../Scheduler/scheduler.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const SchedulerPage = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="scheduler-container">
        <SchedulerSidebar />
        <div className="scheduler-content">
          <Outlet />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default SchedulerPage;
