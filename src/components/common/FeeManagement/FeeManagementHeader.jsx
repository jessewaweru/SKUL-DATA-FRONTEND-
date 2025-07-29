import { Link } from "react-router-dom";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeManagementHeader = () => {
  return (
    <div className="fee-management-header">
      <h1>Fee Management</h1>
      <div className="fee-header-actions">
        <Link
          to="/dashboard/fee-management/uploads"
          className="fee-action-button"
        >
          Upload Fees
        </Link>
        <Link
          to="/dashboard/fee-management/payments"
          className="fee-action-button"
        >
          Record Payment
        </Link>
        <Link
          to="/dashboard/fee-management/reminders"
          className="fee-action-button"
        >
          Send Reminders
        </Link>
      </div>
    </div>
  );
};

export default FeeManagementHeader;
