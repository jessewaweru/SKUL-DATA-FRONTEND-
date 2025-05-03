import "../TeacherDashboardSection/teacherdashboard.css";

const TeacherStatCards = () => {
  return (
    <>
      <TeacherCard
        title="My Students"
        value="42"
        pillText="+2"
        trend="up"
        period="This term"
      />
      <TeacherCard
        title="Pending Reports"
        value="3"
        pillText="Due soon"
        trend="down"
        period="To be submitted"
      />
      <TeacherCard
        title="Attendance Rate"
        value="94%"
        pillText="+2%"
        trend="up"
        period="This month"
      />
    </>
  );
};

export default TeacherStatCards;

const TeacherCard = ({ title, value, pillText, trend, period }) => {
  return (
    <div className="teacher-stat-card">
      <div className="teacher-card-header">
        <div>
          <h3 className="teacher-card-title">{title}</h3>
          <p className="teacher-card-value">{value}</p>
        </div>
        <span
          className={`teacher-pill ${
            trend === "up" ? "teacher-pill-up" : "teacher-pill-down"
          }`}
        >
          {pillText}
        </span>
      </div>
      <p className="teacher-period-text">{period}</p>
    </div>
  );
};
