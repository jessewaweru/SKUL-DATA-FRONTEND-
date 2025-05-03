import { NavLink } from "react-router-dom";
import { FiCalendar, FiList, FiFileText } from "react-icons/fi";
import "../Scheduler/scheduler.css";

const SchedulerSidebar = () => {
  return (
    <div className="scheduler-sidebar">
      <nav>
        <NavLink
          to="/dashboard/scheduler"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FiCalendar />
          <span>Calendar View</span>
        </NavLink>
        <NavLink
          to="/dashboard/scheduler/events"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FiList />
          <span>Manage Events</span>
        </NavLink>
        <NavLink
          to="/dashboard/scheduler/templates"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FiFileText />
          <span>Event Templates</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SchedulerSidebar;
