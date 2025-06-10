// MessagesPage.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUnreadCount } from "../../../../services/messagesService";
import { FiMail } from "react-icons/fi";
import { useWebSocketMessages } from "../../../../hooks/useWebSocketMessages";
import useUser from "../../../../hooks/useUser";
import "../Messages/messages.css";

const MessagesPage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [realTimeUnreadCount, setRealTimeUnreadCount] = useState(0);

  const { data: initialUnreadCount } = useQuery({
    queryKey: ["messages", "unread"],
    queryFn: fetchUnreadCount,
    initialData: 0,
  });

  // WebSocket integration
  useWebSocketMessages(user?.id, {
    onNewMessage: (message) => {
      setRealTimeUnreadCount((prev) => prev + 1);
      queryClient.invalidateQueries(["messages", "inbox"]);
    },
    onMessageDelivered: (receipt) => {
      queryClient.invalidateQueries(["messages", "sent"]);
    },
    onNewNotification: (notification) => {
      if (notification.notification_type === "MESSAGE") {
        queryClient.invalidateQueries(["messages", "unread"]);
      }
    },
  });

  const unreadCount = initialUnreadCount + realTimeUnreadCount;

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2 className="messages-title">
          <FiMail /> Messages
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
      </div>
      <Outlet />
    </div>
  );
};

export default MessagesPage;
