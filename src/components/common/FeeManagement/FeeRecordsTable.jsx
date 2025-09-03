import { Link } from "react-router-dom";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const FeeRecordsTable = ({ records }) => {
  // Ensure records is always an array
  const safeRecords = Array.isArray(records) ? records : [];

  const formatCurrency = (amount) => {
    const numAmount =
      typeof amount === "string" ? parseFloat(amount) : amount || 0;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(numAmount);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
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

  const getStatusDisplay = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A";
  };

  const getTermDisplay = (term) => {
    const termMap = {
      term_1: "Term 1",
      term_2: "Term 2",
      term_3: "Term 3",
    };
    return termMap[term] || term || "N/A";
  };

  const getParentName = (parent) => {
    if (!parent) return "N/A";

    // Try different possible structures for parent name
    if (parent.user) {
      if (parent.user.first_name && parent.user.last_name) {
        return `${parent.user.first_name} ${parent.user.last_name}`;
      }
      if (parent.user.full_name) {
        return parent.user.full_name;
      }
      if (parent.user.name) {
        return parent.user.name;
      }
    }

    if (parent.full_name) return parent.full_name;
    if (parent.name) return parent.name;

    return "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-KE");
    } catch (error) {
      return dateString;
    }
  };

  if (safeRecords.length === 0) {
    return (
      <div className="fee-records-table">
        <div className="no-records">
          <p>No fee records found</p>
          <p>
            Try adjusting your filters or check if fee structures have been
            created.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-records-table">
      <div className="table-responsive">
        <table className="records-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Parent</th>
              <th>Class</th>
              <th>Term/Year</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeRecords.map((record) => (
              <tr
                key={record.id}
                className={record.is_overdue ? "overdue-row" : ""}
              >
                <td>
                  <Link
                    to={`/dashboard/students/profile/${
                      record?.student?.id || ""
                    }`}
                    className="student-link"
                  >
                    {record?.student?.full_name ||
                      record?.student?.name ||
                      "N/A"}
                  </Link>
                  {record?.student?.admission_number && (
                    <div className="admission-number">
                      {record.student.admission_number}
                    </div>
                  )}
                </td>
                <td>
                  <Link
                    to={`/dashboard/parents/${record?.parent?.id || ""}`}
                    className="parent-link"
                  >
                    {getParentName(record?.parent)}
                  </Link>
                </td>
                <td>{record?.fee_structure?.school_class?.name || "N/A"}</td>
                <td>
                  <div className="term-year">
                    {getTermDisplay(record?.fee_structure?.term)}{" "}
                    {record?.fee_structure?.year || "N/A"}
                  </div>
                </td>
                <td className="amount-cell">
                  {formatCurrency(record?.amount_owed)}
                </td>
                <td className="amount-cell">
                  {formatCurrency(record?.amount_paid)}
                </td>
                <td className="amount-cell">
                  <span
                    className={
                      record?.balance && parseFloat(record.balance) > 0
                        ? "balance-owing"
                        : "balance-clear"
                    }
                  >
                    {formatCurrency(record?.balance)}
                  </span>
                </td>
                <td>
                  <div className="due-date">
                    {formatDate(record?.due_date)}
                    {record?.is_overdue && (
                      <div className="overdue-badge">OVERDUE</div>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`fee-status-badge ${getStatusClass(
                      record?.payment_status
                    )}`}
                  >
                    {getStatusDisplay(record?.payment_status)}
                  </span>
                  {record?.payment_percentage && (
                    <div className="payment-percentage">
                      {parseFloat(record.payment_percentage).toFixed(1)}% paid
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/dashboard/fee-management/payments?fee_record_id=${
                        record?.id || ""
                      }`}
                      className="action-link primary"
                    >
                      View Payments
                    </Link>
                    {record?.payment_status !== "paid" && (
                      <Link
                        to={`/dashboard/fee-management/add-payment/${
                          record?.id || ""
                        }`}
                        className="action-link secondary"
                      >
                        Add Payment
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-summary">
        <p>Showing {safeRecords.length} records</p>
      </div>
    </div>
  );
};

export default FeeRecordsTable;
