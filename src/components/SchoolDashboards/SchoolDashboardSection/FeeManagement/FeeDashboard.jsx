import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import RecentFeePayments from "../../../common/FeeManagement/RecentFeePayments";
import FeeSummaryCards from "../../../common/FeeManagement/FeeSummaryCards";
import FeeClassDistributionChart from "../../../common/FeeManagement/FeeClassDistributionChart";
import FeePaymentStatusChart from "../../../common/FeeManagement/FeePaymentStatusChart";
import "./feemanagement.css";

const FeeDashboard = () => {
  const api = useApi();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/fees/fee-records/summary");
        setSummaryData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch fee summary data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-dashboard">
      <h2>Fee Management Dashboard</h2>
      <FeeSummaryCards data={summaryData} />
      <div className="dashboard-charts">
        <div className="fee-chart-container">
          <FeeClassDistributionChart data={summaryData} />
        </div>
        <div className="fee-chart-container">
          <FeePaymentStatusChart data={summaryData} />
        </div>
      </div>
      <RecentFeePayments />
    </div>
  );
};

export default FeeDashboard;
