import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeSummaryCards = ({ data }) => {
  // Safely format currency with fallback for undefined values
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(numAmount);
  };

  // Safely format percentage with fallback for undefined values
  const formatPercentage = (percent) => {
    const numPercent = parseFloat(percent) || 0;
    return numPercent.toFixed(2) + "%";
  };

  // If no data is provided, return a loading state or empty values
  if (!data) {
    return (
      <div className="fee-summary-cards">
        <div className="fee-summary-card">
          <h3>Total Expected</h3>
          <p>{formatCurrency(0)}</p>
          <small>Revenue expected from all fees</small>
        </div>
        <div className="fee-summary-card">
          <h3>Total Collected</h3>
          <p>{formatCurrency(0)}</p>
          <small>Amount successfully collected</small>
        </div>
        <div className="fee-summary-card">
          <h3>Outstanding Balance</h3>
          <p>{formatCurrency(0)}</p>
          <small>Amount still pending</small>
        </div>
        <div className="fee-summary-card">
          <h3>Collection Rate</h3>
          <p>0.00%</p>
          <small>Percentage of fees collected</small>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-summary-cards">
      <div className="fee-summary-card total-expected">
        <h3>Total Expected</h3>
        <p className="amount">{formatCurrency(data.total_expected)}</p>
        <small>Revenue expected from all fees</small>
      </div>
      <div className="fee-summary-card total-collected">
        <h3>Total Collected</h3>
        <p className="amount">{formatCurrency(data.total_paid)}</p>
        <small>Amount successfully collected</small>
      </div>
      <div className="fee-summary-card total-balance">
        <h3>Outstanding Balance</h3>
        <p className="amount">{formatCurrency(data.total_balance)}</p>
        <small>Amount still pending</small>
      </div>
      <div className="fee-summary-card collection-rate">
        <h3>Collection Rate</h3>
        <p className="percentage">{formatPercentage(data.paid_percentage)}</p>
        <small>Percentage of fees collected</small>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(data.paid_percentage || 0, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FeeSummaryCards;
