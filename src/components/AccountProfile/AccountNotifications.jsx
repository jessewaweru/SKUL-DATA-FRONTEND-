import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiBell, FiCheck, FiTrash2, FiFilter } from "react-icons/fi";
import "../AccountProfile/accountprofile.css";

const AccountNotifications = () => {
  const [filter, setFilter] = useState("all");

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/notifications/notifications/");
        // Handle both direct array response and { data: array } response
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        return filter !== "all"
          ? data.filter((n) => n?.is_read === false)
          : data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return []; // Always return array
      }
    },
  });

  // Ensure notifications is always an array
  const notifications = Array.isArray(notificationsData)
    ? notificationsData
    : [];

  const markAsRead = async (id) => {
    try {
      await axios.post(`/api/notifications/notifications/${id}/mark_as_read/`);
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (n) => n?.is_read === false
      );
      await Promise.all(
        unreadNotifications.map((n) =>
          axios.post(`/api/notifications/notifications/${n?.id}/mark_as_read/`)
        )
      );
      refetch();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (isError)
    return <div className="error-message">Error loading notifications</div>;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>
          <FiBell /> Notifications
        </h2>

        <div className="notifications-actions">
          <div className="filter-dropdown">
            <FiFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
            </select>
          </div>

          <button
            className="action-button"
            onClick={markAllAsRead}
            disabled={
              notifications.length === 0 ||
              !notifications.some((n) => n?.is_read === false)
            }
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(
            (notification) =>
              notification?.id && (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.is_read ? "" : "unread"
                  }`}
                >
                  <div className="notification-content">
                    <h4>{notification.title || "No title"}</h4>
                    <p>{notification.message || "No message"}</p>
                    <span className="notification-date">
                      {notification.created_at
                        ? new Date(notification.created_at).toLocaleString()
                        : "Unknown date"}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {notification.is_read === false && (
                      <button
                        className="mark-read-button"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      className="delete-button"
                      title="Delete notification"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              )
          )
        ) : (
          <div className="no-notifications">
            <p>No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountNotifications;
