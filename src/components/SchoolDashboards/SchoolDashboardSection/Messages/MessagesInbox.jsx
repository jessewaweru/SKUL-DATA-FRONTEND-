import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  markAsRead,
} from "../../../../services/messagesService";
import { FiInbox, FiStar, FiRefreshCw } from "react-icons/fi";
import MessageListItem from "./MessageListItem";
import MessageDetail from "./MessageDetail";
import Pagination from "../../../common/Pagination/Pagination";
import { useWebSocketMessages } from "../../../../hooks/useWebSocketMessages";
import useUser from "../../../../hooks/useUser";
import "../Messages/messages.css";

const MessagesInbox = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
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
    queryKey: ["messages", "inbox", page, pageSize, filter],
    queryFn: () =>
      fetchMessages("inbox", {
        page,
        page_size: pageSize,
        status: filter === "all" ? undefined : filter,
      }),
  });

  // WebSocket integration for real-time updates
  useWebSocketMessages(user?.id, {
    onNewMessage: (message) => {
      if (filter !== "unread") {
        queryClient.setQueryData(
          ["messages", "inbox", page, pageSize, filter],
          (old) => ({
            ...old,
            results: [message, ...(old?.results || [])],
          })
        );
      }
      queryClient.invalidateQueries(["messages", "unread"]);
    },
  });

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      await markAsRead(message.id);
      refetch();
    }
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
            <FiInbox /> All
          </button>
          <button
            className={`filter-button ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            <FiInbox /> Unread
          </button>
          <button
            className={`filter-button ${filter === "starred" ? "active" : ""}`}
            onClick={() => setFilter("starred")}
          >
            <FiStar /> Starred
          </button>
          <button className="refresh-button" onClick={handleRefresh}>
            <FiRefreshCw />
          </button>
        </div>

        <div className="messages-list">
          {isLoading ? (
            <div className="loading">Loading messages...</div>
          ) : isError ? (
            <div className="error">Error loading messages</div>
          ) : messages?.results?.length > 0 ? (
            messages.results.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onClick={() => handleMessageClick(message)}
              />
            ))
          ) : (
            <div className="empty">No messages found</div>
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
          />
        ) : (
          <div className="select-message-prompt">Select a message to read</div>
        )}
      </div>
    </div>
  );
};

export default MessagesInbox;
