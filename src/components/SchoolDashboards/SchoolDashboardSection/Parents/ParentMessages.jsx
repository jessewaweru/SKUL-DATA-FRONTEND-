import { useState } from "react";
import { useParams } from "react-router-dom";
import { FiSend, FiMail, FiPhone, FiClock, FiCheck } from "react-icons/fi";
import {
  fetchParentNotifications,
  sendParentMessage,
} from "../../../../services/parentsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import "../Parents/parents.css";

const ParentMessages = () => {
  const { parentId } = useParams();
  const [message, setMessage] = useState("");
  const [sendMethod, setSendMethod] = useState("EMAIL"); // EMAIL, SMS, BOTH

  const { data: messages, isLoading } = useQuery(
    ["parentMessages", parentId],
    () => fetchParentNotifications(parentId)
  );

  const sendMessageMutation = useMutation(
    (data) => sendParentMessage(parentId, data.message, data.method),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["parentMessages", parentId]);
        setMessage("");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate({ message, method: sendMethod });
    }
  };

  return (
    <div className="parent-messages">
      <div className="messages-header">
        <h3>Communications</h3>
        <div className="message-stats">
          <span>
            <FiMail />{" "}
            {messages?.filter((m) => m.method.includes("EMAIL")).length} Emails
          </span>
          <span>
            <FiPhone />{" "}
            {messages?.filter((m) => m.method.includes("SMS")).length} SMS
          </span>
        </div>
      </div>

      <div className="message-container">
        <div className="message-list">
          {isLoading ? (
            <div className="loading">Loading messages...</div>
          ) : messages?.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-item ${msg.is_read ? "read" : "unread"}`}
              >
                <div className="message-meta">
                  <span className="message-type">
                    {msg.method === "EMAIL" ? (
                      <FiMail />
                    ) : msg.method === "SMS" ? (
                      <FiPhone />
                    ) : (
                      <>
                        <FiMail />
                        <FiPhone />
                      </>
                    )}
                  </span>
                  <span className="message-date">
                    <FiClock /> {new Date(msg.created_at).toLocaleString()}
                  </span>
                  {msg.is_read && <FiCheck className="read-indicator" />}
                </div>
                <div className="message-content">{msg.message}</div>
                {msg.sent_by && (
                  <div className="message-sender">
                    Sent by: {msg.sent_by.first_name} {msg.sent_by.last_name}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">No messages yet</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="message-composer">
          <div className="method-selector">
            <label>
              <input
                type="radio"
                checked={sendMethod === "EMAIL"}
                onChange={() => setSendMethod("EMAIL")}
              />
              <FiMail /> Email
            </label>
            <label>
              <input
                type="radio"
                checked={sendMethod === "SMS"}
                onChange={() => setSendMethod("SMS")}
              />
              <FiPhone /> SMS
            </label>
            <label>
              <input
                type="radio"
                checked={sendMethod === "BOTH"}
                onChange={() => setSendMethod("BOTH")}
              />
              <>
                <FiMail />
                <FiPhone />
              </>{" "}
              Both
            </label>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isLoading}
          >
            <FiSend /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentMessages;
