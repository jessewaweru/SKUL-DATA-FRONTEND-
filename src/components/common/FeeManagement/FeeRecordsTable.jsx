import { Link } from "react-router-dom";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeRecordsTable = ({ records }) => {
  // Ensure records is always an array
  const safeRecords = Array.isArray(records) ? records : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0); // Added fallback for undefined amount
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "partial":
        return "status-partial";
      case "unpaid":
        return "status-unpaid";
      case "overdue":
        return "status-overdue";
      default:
        return "";
    }
  };

  if (safeRecords.length === 0) {
    return (
      <div className="fee-records-table">
        <p>No fee records found</p>
      </div>
    );
  }

  return (
    <div className="fee-records-table">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Parent</th>
            <th>Class</th>
            <th>Term/Year</th>
            <th>Amount Due</th>
            <th>Amount Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeRecords.map((record) => (
            <tr key={record.id}>
              <td>
                <Link
                  to={`/dashboard/students/profile/${
                    record?.student?.id || ""
                  }`}
                >
                  {record?.student?.full_name || "N/A"}
                </Link>
              </td>
              <td>
                <Link to={`/dashboard/parents/${record?.parent?.id || ""}`}>
                  {record?.parent?.user?.get_full_name() || "N/A"}
                </Link>
              </td>
              <td>{record?.fee_structure?.school_class?.name || "N/A"}</td>
              <td>
                {record?.fee_structure?.get_term_display?.() || "N/A"}{" "}
                {record?.fee_structure?.year || "N/A"}
              </td>
              <td>{formatCurrency(record?.amount_owed)}</td>
              <td>{formatCurrency(record?.amount_paid)}</td>
              <td>{formatCurrency(record?.balance)}</td>
              <td>
                <span
                  className={`fee-status-badge ${getStatusClass(
                    record?.payment_status
                  )}`}
                >
                  {record?.payment_status || "N/A"}
                </span>
              </td>
              <td>
                <Link
                  to={`/dashboard/fee-management/payments?fee_record_id=${
                    record?.id || ""
                  }`}
                  className="action-link"
                >
                  View Payments
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeRecordsTable;
