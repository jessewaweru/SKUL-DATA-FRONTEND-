import { formatDistanceToNow } from "date-fns";
import { FiStar, FiSend } from "react-icons/fi";

const MessageListItem = ({
  message,
  isSelected,
  onClick,
  variant = "inbox",
}) => {
  return (
    <div
      className={`message-item ${isSelected ? "selected" : ""} ${
        !message.is_read && variant === "inbox" ? "unread" : ""
      }`}
      onClick={onClick}
    >
      <div className="message-item-header">
        <span className="sender">
          {variant === "inbox"
            ? message.sender?.name || "System Notification"
            : `To: ${message.recipients.map((r) => r.name).join(", ")}`}
        </span>
        <span className="time">
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div className="message-item-subject">
        {variant === "sent" && <FiSend style={{ marginRight: "0.5rem" }} />}
        {message.subject || "No subject"}
      </div>
      <div className="message-item-preview">
        {message.body.substring(0, 100)}...
      </div>
      <div className="message-item-actions">
        <button
          className={`star-button ${message.is_starred ? "starred" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            // Toggle star status
          }}
        >
          <FiStar />
        </button>
      </div>
    </div>
  );
};

export default MessageListItem;
