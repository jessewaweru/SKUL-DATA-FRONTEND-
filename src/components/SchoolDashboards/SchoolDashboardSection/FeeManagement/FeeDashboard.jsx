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
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/fees/fee-records/summary");
        const rawData = response.data;
        setSummaryData(rawData);

        // Aggregate the data for summary cards and charts
        const aggregated = aggregateData(rawData);
        setAggregatedData(aggregated);
      } catch (err) {
        setError(err.message || "Failed to fetch fee summary data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const aggregateData = (data) => {
    if (!data || !Array.isArray(data)) return null;

    // Aggregate totals across all classes/terms/years
    const totals = data.reduce(
      (acc, item) => {
        acc.total_expected += parseFloat(item.total_expected || 0);
        acc.total_paid += parseFloat(item.total_paid || 0);
        acc.total_balance += parseFloat(item.total_balance || 0);
        acc.unpaid_count += parseInt(item.unpaid_count || 0);
        acc.partially_paid_count += parseInt(item.partially_paid_count || 0);
        acc.fully_paid_count += parseInt(item.fully_paid_count || 0);
        acc.overdue_count += parseInt(item.overdue_count || 0);
        return acc;
      },
      {
        total_expected: 0,
        total_paid: 0,
        total_balance: 0,
        unpaid_count: 0,
        partially_paid_count: 0,
        fully_paid_count: 0,
        overdue_count: 0,
      }
    );

    // Calculate payment percentage
    totals.paid_percentage =
      totals.total_expected > 0
        ? (totals.total_paid / totals.total_expected) * 100
        : 0;

    return totals;
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-dashboard">
      <h2>Fee Management Dashboard</h2>

      {/* Summary Cards */}
      <FeeSummaryCards data={aggregatedData} />

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="fee-chart-container">
          <FeeClassDistributionChart data={summaryData} />
        </div>
        <div className="fee-chart-container">
          <FeePaymentStatusChart data={aggregatedData} />
        </div>
      </div>

      {/* Recent Payments */}
      <RecentFeePayments />
    </div>
  );
};

export default FeeDashboard;
