import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useApi";
import "../../SchoolDashboards/SchoolDashboardSection/FeeManagement/feemanagement.css";

const ReminderHistory = ({ refresh }) => {
  const api = useApi();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get("/api/fees/fee-reminders");
        setReminders(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch reminder history");
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [refresh]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="fee-error-message">{error}</div>;

  return (
    <div className="reminder-history">
      <h3>Reminder History</h3>
      <table>
        <thead>
          <tr>
            <th>Date Sent</th>
            <th>Student</th>
            <th>Parent</th>
            <th>Term/Year</th>
            <th>Sent Via</th>
            <th>Status</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => (
            <tr key={reminder.id}>
              <td>{formatDate(reminder.sent_at)}</td>
              <td>{reminder.fee_record.student.full_name}</td>
              <td>{reminder.fee_record.parent.user.get_full_name}</td>
              <td>
                {reminder.fee_record.fee_structure.get_term_display()}{" "}
                {reminder.fee_record.fee_structure.year}
              </td>
              <td>{reminder.sent_via}</td>
              <td>
                <span
                  className={`fee-status-badge ${
                    reminder.is_successful ? "status-success" : "status-failed"
                  }`}
                >
                  {reminder.is_successful ? "Success" : "Failed"}
                </span>
              </td>
              <td className="message-cell">{reminder.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReminderHistory;
