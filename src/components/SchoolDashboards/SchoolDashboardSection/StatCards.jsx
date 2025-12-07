import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiUserCheck,
} from "react-icons/fi";
import "../SchoolDashboardSection/dashboard.css";

const StatCards = ({ stats }) => {
  const {
    totalStudents = 0,
    activeTeachers = 0,
    totalClasses = 0,
    totalDocuments = 0,
    avgAttendance = 0,
    pendingFees = 0,
    totalParents = 0,
  } = stats || {};

  return (
    <>
      <Card
        icon={<FiUsers />}
        title="Total Students"
        value={totalStudents.toLocaleString()}
        pillText="Active"
        trend="up"
        period="Enrolled in school"
        color="#3b82f6"
      />
      <Card
        icon={<FiUserCheck />}
        title="Active Teachers"
        value={activeTeachers.toLocaleString()}
        pillText="Teaching"
        trend="up"
        period="Currently on staff"
        color="#10b981"
      />
      <Card
        icon={<FiBookOpen />}
        title="Total Classes"
        value={totalClasses.toLocaleString()}
        pillText="Active"
        trend="neutral"
        period="Academic classes"
        color="#8b5cf6"
      />
      <Card
        icon={<FiFileText />}
        title="School Documents"
        value={totalDocuments.toLocaleString()}
        pillText="Stored"
        trend="up"
        period="In document management"
        color="#f59e0b"
      />
      <Card
        icon={<FiCheckCircle />}
        title="Average Attendance"
        value={`${parseFloat(avgAttendance).toFixed(1)}%`}
        pillText={parseFloat(avgAttendance) >= 85 ? "Good" : "Needs Attention"}
        trend={parseFloat(avgAttendance) >= 85 ? "up" : "down"}
        period="Overall attendance rate"
        color="#06b6d4"
      />
      <Card
        icon={<FiDollarSign />}
        title="Pending School Fees"
        value={`Ksh ${parseFloat(pendingFees).toLocaleString()}`}
        pillText="Unpaid"
        trend="down"
        period="Outstanding balance"
        color="#ef4444"
      />
      <Card
        icon={<FiUsers />}
        title="Total Parents"
        value={totalParents.toLocaleString()}
        pillText="Registered"
        trend="up"
        period="In parent portal"
        color="#ec4899"
      />
    </>
  );
};

export default StatCards;

const Card = ({ icon, title, value, pillText, trend, period, color }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: color, fontSize: "1.25rem" }}>{icon}</span>
            <h3 className="card-title">{title}</h3>
          </div>
          <p className="card-value">{value}</p>
        </div>

        <span
          className={`pill ${
            trend === "up"
              ? "pill-up"
              : trend === "down"
              ? "pill-down"
              : "pill-neutral"
          }`}
        >
          {trend === "up" ? (
            <FiTrendingUp />
          ) : trend === "down" ? (
            <FiTrendingDown />
          ) : null}{" "}
          {pillText}
        </span>
      </div>

      <p className="period-text">{period}</p>
    </div>
  );
};
