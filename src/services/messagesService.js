import api from "./api";

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

export const sendMessage = async (messageData) => {
  const response = await api.post("/notifications/messages/", messageData);
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
