import { useState } from "react";
import { FiMail, FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchParentNotifications,
  markNotificationAsRead,
} from "../../../../services/parentsApi";
import "../Parents/parents.css";

const ParentNotifications = ({ parent }) => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: notifications, refetch } = useQuery(
    ["parentNotifications", parent.id],
    () => fetchParentNotifications(parent.id)
  );

  const markAsReadMutation = useMutation(
    (notificationId) => markNotificationAsRead(notificationId),
    {
      onSuccess: () => refetch(),
    }
  );

  const filteredNotifications = notifications?.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.is_read;
    return notification.notification_type === activeTab;
  });

  return (
    <div className="parent-notifications">
      <div className="notifications-header">
        <h3>Notifications History</h3>
        <div className="tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={activeTab === "unread" ? "active" : ""}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </button>
          <button
            className={activeTab === "ACADEMIC" ? "active" : ""}
            onClick={() => setActiveTab("ACADEMIC")}
          >
            Academic
          </button>
          <button
            className={activeTab === "ATTENDANCE" ? "active" : ""}
            onClick={() => setActiveTab("ATTENDANCE")}
          >
            Attendance
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications?.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.is_read ? "" : "unread"
              }`}
            >
              <div className="notification-icon">
                {notification.notification_type === "ACADEMIC" ? (
                  <FiMail />
                ) : (
                  <FiBell />
                )}
              </div>
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-meta">
                  <span className="type-badge">
                    {notification.notification_type}
                  </span>
                  <span className="date">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="notification-actions">
                {!notification.is_read && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    title="Mark as read"
                  >
                    <FiCheck />
                  </button>
                )}
                <button title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            No notifications found for this filter
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentNotifications;
