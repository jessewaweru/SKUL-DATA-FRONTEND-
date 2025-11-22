import api from "./api";

// NEW: Fetch parents via school endpoint (like teachers)
export const fetchParents = async (schoolId, params = {}) => {
  try {
    // Try the school-specific endpoint first (like teachers)
    const response = await api.get(`schools/${schoolId}/parents/`);

    // The response structure is { school_id, count, parents }
    return response.data.parents || [];
  } catch (error) {
    console.error("Failed to fetch parents:", error);

    // Fallback: try the users endpoint
    try {
      const queryParams = {
        school: schoolId,
        ...params,
      };

      Object.keys(queryParams).forEach((key) => {
        if (
          queryParams[key] === "" ||
          queryParams[key] === undefined ||
          queryParams[key] === null
        ) {
          delete queryParams[key];
        }
      });

      const fallbackResponse = await api.get("users/parents/", {
        params: queryParams,
      });

      return fallbackResponse.data;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw fallbackError;
    }
  }
};

export const fetchParent = async (id) => {
  const response = await api.get(`users/parents/${id}/`); // REMOVED leading /
  return response.data;
};

export const createParent = async (parentData) => {
  const response = await api.post("users/parents/", parentData); // REMOVED leading /
  return response.data;
};

export const updateParent = async (id, updates) => {
  const response = await api.patch(`users/parents/${id}/`, updates); // REMOVED leading /
  return response.data;
};

export const assignChildren = async (id, studentIds, action = "ADD") => {
  const response = await api.post(`users/parents/${id}/assign-children/`, {
    // REMOVED leading /
    student_ids: studentIds,
    action,
  });
  return response.data;
};

export const sendParentMessage = async (id, message, method = "EMAIL") => {
  const response = await api.post(`users/parents/${id}/send-message/`, {
    // REMOVED leading /
    message,
    method,
  });
  return response.data;
};

export const fetchParentNotifications = async (id) => {
  const response = await api.get(`users/parents/${id}/notifications/`); // REMOVED leading /
  return response.data;
};

export const fetchParentDocuments = async (parentId) => {
  const response = await api.get(
    `users/parents/${parentId}/shared-documents/` // REMOVED leading /
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(
    `users/parent-notifications/${notificationId}/mark-as-read/` // REMOVED leading /
  );
  return response.data;
};

export const bulkImportParents = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("send_welcome_email", options.sendWelcomeEmail || false);
    formData.append("default_status", options.defaultStatus || "ACTIVE");

    // Note: schoolId is handled by the backend through the authenticated user
    // No need to send it explicitly unless your backend requires it

    const response = await api.post("users/parents/bulk-import/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle both 200 and 207 status codes
    if (response.status === 207 || response.status === 200) {
      return {
        ...response.data,
        hasPartialSuccess:
          response.data.errors?.length > 0 && response.data.success?.length > 0,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Bulk import error:", error);

    if (error.response) {
      // Handle validation errors from backend
      const errorData = error.response.data;

      // If backend returns structured error with success/errors arrays
      if (errorData.success || errorData.errors) {
        return {
          ...errorData,
          hasPartialSuccess:
            errorData.errors?.length > 0 && errorData.success?.length > 0,
        };
      }

      // Otherwise throw with error message
      throw new Error(errorData.error || errorData.detail || "Import failed");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};

export const downloadParentTemplate = async () => {
  const response = await api.get("users/parents/download-template/", {
    // REMOVED leading /
    responseType: "blob",
  });
  return response.data;
};

export const changeParentStatus = async (id, status, reason = "") => {
  const response = await api.post(`users/parents/${id}/change-status/`, {
    // REMOVED leading /
    status,
    reason,
  });
  return response.data;
};

export const getParentAnalytics = async (params = {}) => {
  const response = await api.get("users/parents/analytics/", { params }); // REMOVED leading /
  return response.data;
};

export const fetchParentStatusChanges = async (params = {}) => {
  const response = await api.get("users/parent-status-changes/", { params }); // REMOVED leading /
  return response.data;
};
