import { useApi } from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import ReminderHistory from "../../../common/FeeManagement/ReminderHistory";
import SendReminders from "../../../common/FeeManagement/SendReminders";
import "./feemanagement.css";

const FeeReminders = () => {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("send");
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
  }, []);

  const handleSendReminders = async (reminderData) => {
    try {
      await api.post("/api/fees/fee-reminders/send_reminders", reminderData);
      // Refresh reminder history after sending
      const response = await api.get("/api/fees/fee-reminders");
      setReminders(response.data);
      setActiveTab("history");
    } catch (err) {
      setError(err.message || "Failed to send reminders");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="fee-reminders">
      <div className="reminder-tabs">
        <button
          className={activeTab === "send" ? "active" : ""}
          onClick={() => setActiveTab("send")}
        >
          Send Reminders
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Reminder History
        </button>
      </div>

      <div className="reminder-content">
        {activeTab === "send" ? (
          <SendReminders onSend={handleSendReminders} />
        ) : (
          <ReminderHistory reminders={reminders} />
        )}
      </div>
    </div>
  );
};

export default FeeReminders;
