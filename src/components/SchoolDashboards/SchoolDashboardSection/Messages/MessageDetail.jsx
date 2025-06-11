import { format } from "date-fns";
import {
  FiTrash2,
  FiStar,
  FiCornerUpRight,
  FiSend,
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";
import { MdReply } from "react-icons/md";

const MessageDetail = ({ message, onDelete, variant = "inbox" }) => {
  return (
    <div className="message-detail">
      <div className="message-header">
        <h3 className="message-subject">
          {variant === "sent" && <FiSend style={{ marginRight: "0.5rem" }} />}
          {message.subject}
        </h3>
        <div className="message-meta">
          <span className="sender">
            {variant === "inbox"
              ? `From: ${message.sender?.name}`
              : `From: You`}
          </span>
          <span className="date">
            {format(new Date(message.created_at), "MMM d, yyyy h:mm a")}
          </span>

          {/* Added status display for sent messages */}
          {variant === "sent" && (
            <span className="message-status">
              {message.status === "delivered" ? (
                <>
                  <FiCheckCircle className="status-icon delivered" />
                  <span>Delivered</span>
                </>
              ) : (
                <>
                  <FiCheck className="status-icon sent" />
                  <span>Sent</span>
                </>
              )}
            </span>
          )}
        </div>
        <div className="message-recipients">
          {variant === "inbox"
            ? `To: You`
            : `To: ${message.recipients.map((r) => r.name).join(", ")}`}
        </div>
      </div>

      <div
        className="message-body"
        dangerouslySetInnerHTML={{ __html: message.body }}
      />

      <div className="message-actions">
        {variant === "inbox" && (
          <button className="action-button">
            <MdReply /> Reply
          </button>
        )}
        <button className="action-button">
          <FiCornerUpRight /> Forward
        </button>
        <button className="action-button" onClick={onDelete}>
          <FiTrash2 /> Delete
        </button>
        <button
          className={`action-button ${message.is_starred ? "starred" : ""}`}
        >
          <FiStar /> {message.is_starred ? "Unstar" : "Star"}
        </button>
      </div>

      {message.attachments?.length > 0 && (
        <div className="message-attachments">
          <h4>Attachments:</h4>
          <div className="attachments-list">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-item">
                <a
                  href={attachment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
