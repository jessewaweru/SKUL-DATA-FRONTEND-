import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCards = () => {
  return (
    <>
      <Card
        title="Gross Revenue"
        value="$120,054.24"
        pillText="2.75%"
        trend="up"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Avg Order"
        value="$27.97"
        pillText="1.01%"
        trend="down"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Trailing Year"
        value="$278,054.24"
        pillText="60.75%"
        trend="up"
        period="Previous 365 days"
      />
    </>
  );
};

export default StatCards;

const Card = ({ title, value, pillText, trend, period }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-value">{value}</p>
        </div>

        <span className={`pill ${trend === "up" ? "pill-up" : "pill-down"}`}>
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
        </span>
      </div>

      <p className="period-text">{period}</p>
    </div>
  );
};
