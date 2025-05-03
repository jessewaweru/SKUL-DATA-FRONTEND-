import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiMail, FiInbox, FiSend, FiSearch, FiPlus } from "react-icons/fi";
import "../AccountProfile/accountprofile.css";

const AccountMessages = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data: inboxData, isLoading: inboxLoading } = useQuery({
    queryKey: ["messagesInbox"],
    queryFn: async () => {
      const response = await axios.get("/api/notifications/messages/");
      return response.data || []; // Ensure we always return an array
    },
  });

  const { data: sentData, isLoading: sentLoading } = useQuery({
    queryKey: ["messagesSent"],
    queryFn: async () => {
      const response = await axios.get("/api/notifications/messages/sent/");
      return response.data || []; // Ensure we always return an array
    },
  });

  // Safely get the messages data, defaulting to empty array if undefined
  const inbox = Array.isArray(inboxData) ? inboxData : [];
  const sent = Array.isArray(sentData) ? sentData : [];

  if (inboxLoading || sentLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="sidebar-header">
          <h2>
            <FiMail /> Messages
          </h2>
          <button className="compose-button">
            <FiPlus /> New Message
          </button>
        </div>

        <div className="sidebar-tabs">
          <button
            className={`tab-button ${activeTab === "inbox" ? "active" : ""}`}
            onClick={() => setActiveTab("inbox")}
          >
            <FiInbox /> Inbox ({inbox.length})
          </button>
          <button
            className={`tab-button ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            <FiSend /> Sent ({sent.length})
          </button>
        </div>

        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Search messages..." />
        </div>

        <div className="message-list">
          {(activeTab === "inbox" ? inbox : sent).map((message) => (
            <div
              key={message.id}
              className={`message-preview ${!message.is_read ? "unread" : ""} ${
                selectedMessage?.id === message.id ? "selected" : ""
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <h4>
                {activeTab === "inbox"
                  ? message.sender?.name || "Unknown sender"
                  : message.recipient?.name || "Unknown recipient"}
              </h4>
              <p className="message-subject">
                {message.subject || "No subject"}
              </p>
              <p className="message-excerpt">
                {(message.body || "").substring(0, 60)}...
              </p>
              <span className="message-date">
                {message.created_at
                  ? new Date(message.created_at).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="message-content">
        {selectedMessage ? (
          <>
            <div className="message-header">
              <h3>{selectedMessage.subject || "No subject"}</h3>
              <div className="message-meta">
                <span>
                  <strong>{activeTab === "inbox" ? "From:" : "To:"}</strong>{" "}
                  {activeTab === "inbox"
                    ? selectedMessage.sender?.name || "Unknown sender"
                    : selectedMessage.recipient?.name || "Unknown recipient"}
                </span>
                <span>
                  <strong>Date:</strong>{" "}
                  {selectedMessage.created_at
                    ? new Date(selectedMessage.created_at).toLocaleString()
                    : "Unknown date"}
                </span>
              </div>
            </div>

            <div className="message-body">
              <p>{selectedMessage.body || "No message content"}</p>
            </div>

            {Array.isArray(selectedMessage.attachments) &&
              selectedMessage.attachments.length > 0 && (
                <div className="message-attachments">
                  <h4>Attachments:</h4>
                  <div className="attachments-list">
                    {selectedMessage.attachments.map((attachment) => (
                      <div key={attachment.id} className="attachment-item">
                        <span>
                          {attachment.original_filename || "Unnamed file"}
                        </span>
                        <a
                          href={attachment.file}
                          download
                          className="download-button"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="message-actions">
              <button className="action-button">
                {activeTab === "inbox" ? "Reply" : "Resend"}
              </button>
              <button className="action-button">Forward</button>
              <button className="action-button danger">Delete</button>
            </div>
          </>
        ) : (
          <div className="no-message-selected">
            <FiMail size={48} />
            <p>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountMessages;
