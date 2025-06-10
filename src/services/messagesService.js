import api from "./api";
import { webSocketService } from "./websocketService";

export const sendMessage = async (messageData) => {
  try {
    // First try WebSocket
    if (
      webSocketService.sendMessage({
        type: "message",
        message: messageData,
        action: "send",
      })
    ) {
      return { success: true };
    }

    // Fallback to REST API
    const response = await api.post("/notifications/messages/", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const fetchMessages = async (type = "inbox", params = {}) => {
  const endpoint = type === "sent" ? "sent" : "";
  const response = await api.get(`/notifications/messages/${endpoint}`, {
    params,
  });
  return response.data;
};

export const fetchMessage = async (id) => {
  const response = await api.get(`/notifications/messages/${id}/`);
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await api.delete(`/notifications/messages/${id}/`);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.post(
    `/notifications/messages/${id}/mark_as_read/`
  );
  return response.data;
};

export const fetchMessageRecipients = async (search = "") => {
  const response = await api.get("/notifications/messages/recipients/", {
    params: { search },
  });
  return response.data;
};

export const fetchUnreadCount = async () => {
  const response = await api.get("/notifications/messages/unread_count/");
  return response.data;
};

export const bulkMarkAsRead = async (messageIds) => {
  const response = await api.post(
    "/notifications/messages/bulk_mark_as_read/",
    {
      message_ids: messageIds,
    }
  );
  return response.data;
};
