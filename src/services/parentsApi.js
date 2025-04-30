import api from "./api";

export const fetchParents = async (params = {}) => {
  const response = await api.get("/parents/", { params });
  return response.data;
};

// export const fetchAllParents = async (params = {}) => {
//     const response = await api.get('/parents/all/', { params });
//     return response.data;
//   };

export const fetchParent = async (id) => {
  const response = await api.get(`/parents/${id}/`);
  return response.data;
};

export const createParent = async (parentData) => {
  const response = await api.post("/parents/", parentData);
  return response.data;
};

export const updateParent = async (id, updates) => {
  const response = await api.patch(`/parents/${id}/`, updates);
  return response.data;
};

export const assignChildren = async (id, studentIds, action = "ADD") => {
  const response = await api.post(`/parents/${id}/assign_children/`, {
    student_ids: studentIds,
    action,
  });
  return response.data;
};

export const sendParentMessage = async (id, message, method = "EMAIL") => {
  const response = await api.post(`/parents/${id}/send_message/`, {
    message,
    method,
  });
  return response.data;
};

export const fetchParentNotifications = async (id) => {
  const response = await api.get(`/parents/${id}/notifications/`);
  return response.data;
};

export const fetchParentDocuments = async (parentId) => {
  const response = await api.get(`/parents/${parentId}/shared_documents/`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(
    `/parent-notifications/${notificationId}/mark_as_read/`
  );
  return response.data;
};
