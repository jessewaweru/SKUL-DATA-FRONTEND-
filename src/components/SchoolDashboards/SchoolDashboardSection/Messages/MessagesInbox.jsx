import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  markAsRead,
} from "../../../../services/messagesService";
import { FiInbox, FiStar, FiRefreshCw, FiMail } from "react-icons/fi";
import MessageListItem from "./MessageListItem";
import MessageDetail from "./MessageDetail";
import Pagination from "../../../common/Pagination/Pagination";
import { useWebSocketMessages } from "../../../../hooks/useWebSocketMessages";
import useUser from "../../../../hooks/useUser";
import "./messages.css";

const MessagesInbox = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("all");

  const {
    data: messagesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", "inbox", page, pageSize, filter],
    queryFn: () =>
      fetchMessages("inbox", {
        page,
        page_size: pageSize,
        status: filter === "all" ? undefined : filter,
      }),
    enabled: !!user?.id,
    retry: (failureCount, error) => {
      // Don't retry on 404, 403, or 500 errors
      if (error?.response?.status >= 400) {
        return false;
      }
      return failureCount < 3;
    },
    // Add error boundary
    onError: (error) => {
      console.error("Query error:", error);
    },
  });

  // WebSocket integration for real-time updates
  useWebSocketMessages(user?.id, {
    onNewMessage: (message) => {
      // Update the messages list with new message
      queryClient.setQueryData(
        ["messages", "inbox", page, pageSize, filter],
        (old) => {
          if (!old) return { results: [message], count: 1 };

          return {
            ...old,
            results: [message, ...(old?.results || [])],
            count: (old?.count || 0) + 1,
          };
        }
      );

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
    },
  });

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);

    // Mark as read if unread
    if (!message.is_read) {
      try {
        await markAsRead(message.id);

        // Update the message in the cache
        queryClient.setQueryData(
          ["messages", "inbox", page, pageSize, filter],
          (old) => {
            if (!old) return old;

            return {
              ...old,
              results: old.results.map((msg) =>
                msg.id === message.id ? { ...msg, is_read: true } : msg
              ),
            };
          }
        );

        // Update selected message state
        setSelectedMessage({ ...message, is_read: true });

        // Invalidate unread count
        queryClient.invalidateQueries({ queryKey: ["messages", "unread"] });
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filter
    setSelectedMessage(null); // Clear selected message
  };

  // Extract messages and pagination info
  const messages = messagesResponse?.results || [];
  const totalCount = messagesResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Enhanced error handling
  const renderError = () => {
    const errorStatus = error?.response?.status || error?.status;
    const errorMessage = error?.response?.data?.detail || error?.message;

    return (
      <div className="error">
        <h3>Error Loading Messages</h3>
        {errorStatus === 500 ? (
          <>
            <p>Server error occurred. This might be due to:</p>
            <ul>
              <li>Database connection issues</li>
              <li>User profile not properly configured</li>
              <li>School association missing</li>
            </ul>
          </>
        ) : errorStatus === 403 ? (
          <p>You don't have permission to view these messages.</p>
        ) : errorStatus === 404 ? (
          <p>Messages endpoint not found.</p>
        ) : (
          <p>Network error or server unavailable.</p>
        )}
        {errorMessage && (
          <p className="error-details">Details: {errorMessage}</p>
        )}
        <button onClick={handleRefresh} className="retry-button">
          Try Again
        </button>
      </div>
    );
  };

  // Loading state with user check
  if (!user) {
    return (
      <div className="messages-content">
        <div className="loading">Please log in to view messages</div>
      </div>
    );
  }

  // Debug information (remove in production)
  if (import.meta.env.MODE === "development") {
    console.log("User data:", user);
    console.log("Messages response:", messagesResponse);
    console.log("Error:", error);
  }

  return (
    <div className="messages-content">
      <div className="messages-sidebar">
        <div className="messages-toolbar">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            <FiInbox /> All ({totalCount})
          </button>
          <button
            className={`filter-button ${filter === "unread" ? "active" : ""}`}
            onClick={() => handleFilterChange("unread")}
          >
            <FiMail /> Unread
          </button>
          <button
            className={`filter-button ${filter === "read" ? "active" : ""}`}
            onClick={() => handleFilterChange("read")}
          >
            <FiMail /> Read
          </button>
          <button
            className={`filter-button ${filter === "starred" ? "active" : ""}`}
            onClick={() => handleFilterChange("starred")}
            disabled={true}
            title="Starred messages feature coming soon"
          >
            <FiStar /> Starred
          </button>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <FiRefreshCw className={isLoading ? "spinning" : ""} />
          </button>
        </div>

        <div className="messages-list">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading messages...
            </div>
          ) : isError ? (
            renderError()
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onClick={() => handleMessageClick(message)}
              />
            ))
          ) : (
            <div className="empty">
              <FiInbox size={48} />
              <p>
                {filter === "all"
                  ? "No messages found"
                  : `No ${filter} messages found`}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => handleFilterChange("all")}
                  className="view-all-button"
                >
                  View All Messages
                </button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
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
            onMarkAsRead={() => {
              if (!selectedMessage.is_read) {
                handleMessageClick(selectedMessage);
              }
            }}
          />
        ) : (
          <div className="select-message-prompt">
            <FiMail size={64} />
            <h3>Select a message to read</h3>
            <p>Choose a message from the list to view its contents</p>
            {import.meta.env.MODE === "development" && (
              <div className="debug-info">
                <p>Debug - User ID: {user?.id}</p>
                <p>Debug - User Type: {user?.user_type}</p>
                <p>Debug - School ID: {user?.role?.school || "Not found"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesInbox;
