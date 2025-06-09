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

export const bulkImportParents = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("send_welcome_email", options.sendWelcomeEmail || false);
    formData.append("default_status", options.defaultStatus || "ACTIVE");

    const response = await api.post("/parents/bulk-import/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 207) {
      // Handle multi-status responses
      return {
        ...response.data,
        hasPartialSuccess:
          response.data.errors.length > 0 && response.data.success.length > 0,
      };
    }

    return response.data;
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error || "Import failed");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
};

export const downloadParentTemplate = async () => {
  const response = await api.get("/parents/download-template/", {
    responseType: "blob", // Important for file downloads
  });
  return response.data;
};
