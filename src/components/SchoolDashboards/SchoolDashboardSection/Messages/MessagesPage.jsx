import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "../../../../services/messagesService";
import { FiMail } from "react-icons/fi";
import "../Messages/messages.css";

const MessagesPage = () => {
  const { data: unreadCount } = useQuery({
    queryKey: ["messages", "unread"],
    queryFn: fetchUnreadCount,
  });

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2 className="messages-title">
          <FiMail /> Messages
          {unreadCount && unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
      </div>
      <Outlet />
    </div>
  );
};

export default MessagesPage;
