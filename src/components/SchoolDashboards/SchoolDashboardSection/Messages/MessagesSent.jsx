import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../../../services/messagesService";
import { FiSend, FiRefreshCw } from "react-icons/fi";
import MessageListItem from "./MessageListItem";
import MessageDetail from "./MessageDetail";
import Pagination from "../../../common/Pagination/Pagination";

const MessagesSent = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("all");

  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["messages", "sent", page, pageSize, filter],
    queryFn: () =>
      fetchMessages("sent", {
        page,
        page_size: pageSize,
        status: filter === "all" ? undefined : filter,
      }),
  });

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="messages-content">
      <div className="messages-sidebar">
        <div className="messages-toolbar">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <FiSend /> All
          </button>
          <button
            className={`filter-button ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            <FiSend /> Unread Replies
          </button>
          <button className="refresh-button" onClick={handleRefresh}>
            <FiRefreshCw />
          </button>
        </div>

        <div className="messages-list">
          {isLoading ? (
            <div className="loading">Loading sent messages...</div>
          ) : isError ? (
            <div className="error">Error loading sent messages</div>
          ) : messages?.results?.length > 0 ? (
            messages.results.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onClick={() => handleMessageClick(message)}
                variant="sent" // This prop will adjust the display for sent messages
              />
            ))
          ) : (
            <div className="empty">No sent messages found</div>
          )}
        </div>

        {messages && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(messages.count / pageSize)}
            onPageChange={setPage}
          />
        )}
      </div>

      <div className="message-detail-container">
        {selectedMessage ? (
          <MessageDetail
            message={selectedMessage}
            onDelete={() => {
              setSelectedMessage(null);
              refetch();
            }}
            variant="sent" // This prop will adjust the display for sent messages
          />
        ) : (
          <div className="select-message-prompt">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSent;
