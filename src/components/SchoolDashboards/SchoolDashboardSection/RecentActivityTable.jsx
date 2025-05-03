import { FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import { FiArrowUpRight } from "react-icons/fi";

const RecentActivityTable = () => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">
          <FiDollarSign /> Recent Transactions
        </h3>
        <button className="see-all-button">See all</button>
      </div>
      <table className="data-table">
        <TableHead />
        <tbody>
          <TableRow
            userId="USER_2941"
            userRole="Admin"
            dataAccessed="User Profiles"
            timestamp="Apr 1, 2025 10:23 AM"
            orderAccessed={1}
          />
          <TableRow
            userId="USER_1587"
            userRole="Editor"
            dataAccessed="Financial Records"
            timestamp="Apr 1, 2025 09:45 AM"
            orderAccessed={2}
          />
          <TableRow
            userId="USER_3094"
            userRole="Viewer"
            dataAccessed="Analytics Dashboard"
            timestamp="Mar 31, 2025 04:12 PM"
            orderAccessed={3}
          />
          <TableRow
            userId="USER_0491"
            userRole="Admin"
            dataAccessed="System Settings"
            timestamp="Mar 31, 2025 02:30 PM"
            orderAccessed={4}
          />
          <TableRow
            userId="USER_8765"
            userRole="Editor"
            dataAccessed="Product Database"
            timestamp="Mar 31, 2025 11:18 AM"
            orderAccessed={5}
          />
          <TableRow
            userId="USER_4321"
            userRole="Viewer"
            dataAccessed="Customer Reports"
            timestamp="Mar 30, 2025 05:47 PM"
            orderAccessed={6}
          />
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;

const TableHead = () => {
  return (
    <thead>
      <tr className="table-head-row">
        <th className="table-head-cell">User ID</th>
        <th className="table-head-cell">User Role</th>
        <th className="table-head-cell">Data Accessed</th>
        <th className="table-head-cell">Timestamp</th>
        <th className="cell-width-options"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  userId,
  userRole,
  dataAccessed,
  timestamp,
  orderAccessed,
}) => {
  return (
    <tr className={orderAccessed % 2 ? "table-row-odd" : "table-row-even"}>
      <td className="table-cell">
        <a href="#" className="user-id-link">
          {userId} <FiArrowUpRight />
        </a>
      </td>
      <td className="table-cell">{userRole}</td>
      <td className="table-cell">{dataAccessed}</td>
      <td className="table-cell">{timestamp}</td>
      <td className="cell-width-options">
        <button className="action-button">
          <FiMoreHorizontal />
        </button>
      </td>
    </tr>
  );
};
