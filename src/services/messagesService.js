import api from "./api";
import { webSocketService } from "./websocketService";

export const sendMessage = async (messageData) => {
  try {
    // Use REST API for sending messages
    const response = await api.post("/notifications/messages/", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const fetchMessages = async (type = "inbox", params = {}) => {
  try {
    let endpoint;

    if (type === "sent") {
      endpoint = "/notifications/messages/sent/";
    } else {
      // Default inbox
      endpoint = "/notifications/messages/";
    }

    const response = await api.get(endpoint, {
      params: {
        ...params,
        // Ensure proper parameter naming
        page: params.page || 1,
        page_size: params.page_size || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const fetchMessage = async (id) => {
  try {
    const response = await api.get(`/notifications/messages/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await api.delete(`/notifications/messages/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await api.post(
      `/notifications/messages/${id}/mark_as_read/`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const fetchMessageRecipients = async (search = "") => {
  try {
    const response = await api.get("/notifications/messages/recipients/", {
      params: search ? { search } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    throw error;
  }
};

export const fetchUnreadCount = async () => {
  try {
    const response = await api.get("/notifications/messages/unread_count/");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

export const bulkMarkAsRead = async (messageIds) => {
  try {
    const response = await api.post(
      "/notifications/messages/bulk_mark_as_read/",
      {
        message_ids: messageIds,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error bulk marking messages as read:", error);
    throw error;
  }
};

export const fetchNotifications = async (params = {}) => {
  try {
    const response = await api.get("/notifications/notifications/", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.post(
      `/notifications/notifications/${id}/mark_as_read/`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const fetchNotificationUnreadCount = async () => {
  try {
    const response = await api.get(
      "/notifications/notifications/unread_count/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notification unread count:", error);
    throw error;
  }
};
