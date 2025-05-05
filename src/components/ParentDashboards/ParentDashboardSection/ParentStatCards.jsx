import "../ParentDashboardSection/parentdashboard.css";
import { FiUsers, FiMail, FiCalendar } from "react-icons/fi";

const ParentStatCards = () => {
  return (
    <>
      <ParentCard
        title="Children"
        value="3"
        icon={<FiUsers />}
        trend="neutral"
        period="Enrolled this term"
      />
      <ParentCard
        title="Unread Messages"
        value="2"
        icon={<FiMail />}
        trend="up"
        period="From teachers/school"
      />
      <ParentCard
        title="Upcoming Events"
        value="5"
        icon={<FiCalendar />}
        trend="neutral"
        period="This month"
      />
    </>
  );
};

const ParentCard = ({ title, value, icon, period }) => {
  return (
    <div className="parent-stat-card">
      <div className="parent-card-header">
        <div>
          <h3 className="parent-card-title">{title}</h3>
          <p className="parent-card-value">{value}</p>
        </div>
        <div className="parent-card-icon">{icon}</div>
      </div>
      <p className="parent-period-text">{period}</p>
    </div>
  );
};

export default ParentStatCards;
