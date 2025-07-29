import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeSummaryCards = ({ data }) => {
  // Safely format currency with fallback for undefined values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  // Safely format percentage with fallback for undefined values
  const formatPercentage = (percent) => {
    return typeof percent === "number" ? percent.toFixed(2) + "%" : "0.00%";
  };

  // If no data is provided, return a loading state or empty values
  if (!data) {
    return (
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Expected</h3>
          <p>{formatCurrency(0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Paid</h3>
          <p>{formatCurrency(0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Balance</h3>
          <p>{formatCurrency(0)}</p>
        </div>
        <div className="summary-card">
          <h3>Payment Rate</h3>
          <p>0.00%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <h3>Total Expected</h3>
        <p>{formatCurrency(data.total_expected)}</p>
      </div>
      <div className="summary-card">
        <h3>Total Paid</h3>
        <p>{formatCurrency(data.total_paid)}</p>
      </div>
      <div className="summary-card">
        <h3>Total Balance</h3>
        <p>{formatCurrency(data.total_balance)}</p>
      </div>
      <div className="summary-card">
        <h3>Payment Rate</h3>
        <p>{formatPercentage(data.paid_percentage)}</p>
      </div>
    </div>
  );
};

export default FeeSummaryCards;
