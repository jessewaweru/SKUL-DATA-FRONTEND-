import api from "./api";

// export const fetchParents = async (params = {}) => {
//   // Fixed: Changed from "/parents/" to "/users/parents/"
//   const response = await api.get("/users/parents/", { params });
//   return response.data;
// };

export const fetchParents = async (schoolId, params = {}) => {
  const response = await api.get("/users/parents/", {
    params: { ...params, school: schoolId },
  });
  return response.data;
};

export const fetchParent = async (id) => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.get(`/users/parents/${id}/`);
  return response.data;
};

export const createParent = async (parentData) => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.post("/users/parents/", parentData);
  return response.data;
};

export const updateParent = async (id, updates) => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.patch(`/users/parents/${id}/`, updates);
  return response.data;
};

export const assignChildren = async (id, studentIds, action = "ADD") => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.post(`/users/parents/${id}/assign-children/`, {
    student_ids: studentIds,
    action,
  });
  return response.data;
};

export const sendParentMessage = async (id, message, method = "EMAIL") => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.post(`/users/parents/${id}/send-message/`, {
    message,
    method,
  });
  return response.data;
};

export const fetchParentNotifications = async (id) => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.get(`/users/parents/${id}/notifications/`);
  return response.data;
};

export const fetchParentDocuments = async (parentId) => {
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.get(
    `/users/parents/${parentId}/shared-documents/`
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  // Fixed: Changed from "/parent-notifications/" to "/users/parent-notifications/"
  const response = await api.post(
    `/users/parent-notifications/${notificationId}/mark-as-read/`
  );
  return response.data;
};

export const bulkImportParents = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("send_welcome_email", options.sendWelcomeEmail || false);
    formData.append("default_status", options.defaultStatus || "ACTIVE");

    // Fixed: Changed from "/parents/" to "/users/parents/"
    const response = await api.post("/users/parents/bulk-import/", formData, {
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
  // Fixed: Changed from "/parents/" to "/users/parents/"
  const response = await api.get("/users/parents/download-template/", {
    responseType: "blob", // Important for file downloads
  });
  return response.data;
};

// Additional helper functions that might be useful
export const changeParentStatus = async (id, status, reason = "") => {
  const response = await api.post(`/users/parents/${id}/change-status/`, {
    status,
    reason,
  });
  return response.data;
};

export const getParentAnalytics = async (params = {}) => {
  const response = await api.get("/users/parents/analytics/", { params });
  return response.data;
};

export const fetchParentStatusChanges = async (params = {}) => {
  const response = await api.get("/users/parent-status-changes/", { params });
  return response.data;
};

// import api from "./api";

// export const fetchParents = async (params = {}) => {
//   try {
//     // Clean up params - remove empty values
//     const cleanParams = Object.keys(params).reduce((acc, key) => {
//       if (
//         params[key] !== "" &&
//         params[key] !== null &&
//         params[key] !== undefined
//       ) {
//         acc[key] = params[key];
//       }
//       return acc;
//     }, {});

//     console.log("Fetching parents with params:", cleanParams);

//     // Try the main parents endpoint first
//     try {
//       console.log("Attempting primary endpoint: /api/users/parents/");
//       const response = await api.get("/api/users/parents/", {
//         params: cleanParams,
//       });

//       console.log("Primary endpoint success:", {
//         status: response.status,
//         dataType: typeof response.data,
//         count: response.data?.count || response.data?.length || 0,
//         hasResults: !!response.data?.results,
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Primary endpoint failed:", {
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         message: error.message,
//       });

//       // If it's an authentication/permission error, don't try fallback
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         throw error;
//       }

//       // If parents endpoint fails with 404, try fallback to users endpoint
//       if (error.response?.status === 404) {
//         console.log("Falling back to users endpoint with parent filter...");

//         const fallbackParams = {
//           ...cleanParams,
//           user_type: "PARENT",
//         };

//         try {
//           const fallbackResponse = await api.get("/api/users/", {
//             params: fallbackParams,
//           });

//           console.log("Fallback endpoint success:", {
//             status: fallbackResponse.status,
//             count: fallbackResponse.data?.length || 0,
//           });

//           // Transform the user data to match parent structure
//           const users = Array.isArray(fallbackResponse.data)
//             ? fallbackResponse.data
//             : [];

//           const parents = users
//             .filter((user) => user.user_type === "PARENT")
//             .map((user) => ({
//               id: user.id,
//               username: user.username,
//               email: user.email,
//               first_name: user.first_name,
//               last_name: user.last_name,
//               phone_number: user.phone_number || null,
//               school: user.school,
//               children: [],
//               children_details: [],
//               children_count: 0,
//               address: null,
//               occupation: null,
//               status: user.is_active ? "ACTIVE" : "INACTIVE",
//               preferred_language: "en",
//               receive_email_notifications: true,
//               last_login: user.last_login,
//               created_at: user.date_joined,
//               updated_at: user.date_joined,
//             }));

//           // Apply search filter manually for fallback
//           let filteredParents = parents;
//           if (cleanParams.search) {
//             const searchTerm = cleanParams.search.toLowerCase();
//             filteredParents = parents.filter(
//               (parent) =>
//                 parent.first_name?.toLowerCase().includes(searchTerm) ||
//                 parent.last_name?.toLowerCase().includes(searchTerm) ||
//                 parent.email?.toLowerCase().includes(searchTerm) ||
//                 parent.phone_number?.includes(searchTerm)
//             );
//           }

//           // Apply status filter manually for fallback
//           if (cleanParams.status) {
//             filteredParents = filteredParents.filter(
//               (parent) => parent.status === cleanParams.status
//             );
//           }

//           return {
//             results: filteredParents,
//             count: filteredParents.length,
//             fallback: true,
//           };
//         } catch (fallbackError) {
//           console.error("Fallback endpoint also failed:", fallbackError);
//           throw fallbackError;
//         }
//       }

//       throw error;
//     }
//   } catch (error) {
//     console.error("Error fetching parents:", error);

//     // Enhanced error logging for debugging
//     if (error.response) {
//       console.error("API Error Details:", {
//         status: error.response.status,
//         statusText: error.response.statusText,
//         data: error.response.data,
//         url: error.config?.url,
//         method: error.config?.method,
//         headers: error.config?.headers,
//       });
//     } else if (error.request) {
//       console.error("Network Error:", {
//         message: "No response received from server",
//         request: error.request,
//       });
//     } else {
//       console.error("Request Setup Error:", error.message);
//     }

//     throw error;
//   }
// };

// export const fetchParent = async (id) => {
//   try {
//     const response = await api.get(`/api/users/parents/${id}/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching parent:", error);
//     throw error;
//   }
// };

// export const createParent = async (parentData) => {
//   try {
//     const response = await api.post("/api/users/parents/", parentData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating parent:", error);
//     throw error;
//   }
// };

// export const updateParent = async (id, updates) => {
//   try {
//     const response = await api.patch(`/api/users/parents/${id}/`, updates);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating parent:", error);
//     throw error;
//   }
// };

// export const assignChildren = async (id, studentIds, action = "ADD") => {
//   try {
//     const response = await api.post(
//       `/api/users/parents/${id}/assign-children/`,
//       {
//         student_ids: studentIds,
//         action,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error assigning children:", error);
//     throw error;
//   }
// };

// export const sendParentMessage = async (id, message, method = "EMAIL") => {
//   try {
//     const response = await api.post(`/api/users/parents/${id}/send-message/`, {
//       message,
//       method,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending parent message:", error);
//     throw error;
//   }
// };

// export const fetchParentNotifications = async (id) => {
//   try {
//     const response = await api.get(`/api/users/parents/${id}/notifications/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching parent notifications:", error);
//     throw error;
//   }
// };

// export const fetchParentDocuments = async (parentId) => {
//   try {
//     const response = await api.get(
//       `/api/users/parents/${parentId}/shared-documents/`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching parent documents:", error);
//     throw error;
//   }
// };

// export const markNotificationAsRead = async (notificationId) => {
//   try {
//     const response = await api.post(
//       `/api/users/parent-notifications/${notificationId}/mark-as-read/`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     throw error;
//   }
// };

// export const bulkImportParents = async (file, options = {}) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("send_welcome_email", options.sendWelcomeEmail || false);
//     formData.append("default_status", options.defaultStatus || "ACTIVE");

//     const response = await api.post(
//       "/api/users/parents/bulk-import/",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     if (response.status === 207) {
//       return {
//         ...response.data,
//         hasPartialSuccess:
//           response.data.errors.length > 0 && response.data.success.length > 0,
//       };
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error in bulk import:", error);
//     if (error.response) {
//       throw new Error(error.response.data.error || "Import failed");
//     } else if (error.request) {
//       throw new Error("No response from server");
//     } else {
//       throw new Error(error.message);
//     }
//   }
// };

// export const downloadParentTemplate = async () => {
//   try {
//     const response = await api.get("/api/users/parents/download-template/", {
//       responseType: "blob",
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error downloading parent template:", error);
//     throw error;
//   }
// };

// export const changeParentStatus = async (id, status, reason = "") => {
//   try {
//     const response = await api.post(`/api/users/parents/${id}/change-status/`, {
//       status,
//       reason,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error changing parent status:", error);
//     throw error;
//   }
// };

// export const getParentAnalytics = async (params = {}) => {
//   try {
//     const response = await api.get("/api/users/parents/analytics/", { params });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching parent analytics:", error);
//     throw error;
//   }
// };

// export const fetchParentStatusChanges = async (params = {}) => {
//   try {
//     const response = await api.get("/api/users/parent-status-changes/", {
//       params,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching parent status changes:", error);
//     throw error;
//   }
// };

// // Debug function to test authentication and endpoint
// export const testAuthAndEndpoint = async () => {
//   try {
//     console.log("Testing authentication and parents endpoint...");

//     // First test if we're authenticated
//     try {
//       const userResponse = await api.get("/api/users/me/");
//       console.log("✅ Authentication test passed:", {
//         user: userResponse.data.username,
//         userType: userResponse.data.user_type,
//         schoolId: userResponse.data.school,
//       });
//     } catch (authError) {
//       console.error(
//         "❌ Authentication test failed:",
//         authError.response?.status
//       );
//       return {
//         success: false,
//         error: "Authentication failed",
//         details: authError.response?.data,
//       };
//     }

//     // Then test the parents endpoint
//     const response = await api.get("/api/users/parents/", {
//       params: { limit: 5 }, // Small limit for testing
//       timeout: 10000,
//     });

//     console.log("✅ Parents endpoint test successful:", {
//       status: response.status,
//       dataType: typeof response.data,
//       hasResults: response.data?.hasOwnProperty("results"),
//       count: response.data?.count || response.data?.length || 0,
//     });

//     return {
//       success: true,
//       data: response.data,
//       authenticated: true,
//     };
//   } catch (error) {
//     console.error("❌ Endpoint test failed:", error);
//     return {
//       success: false,
//       error: error.message,
//       status: error.response?.status,
//       details: error.response?.data,
//     };
//   }
// };

// // Export default for convenience
// export default {
//   fetchParents,
//   fetchParent,
//   createParent,
//   updateParent,
//   assignChildren,
//   sendParentMessage,
//   fetchParentNotifications,
//   fetchParentDocuments,
//   markNotificationAsRead,
//   bulkImportParents,
//   downloadParentTemplate,
//   changeParentStatus,
//   getParentAnalytics,
//   fetchParentStatusChanges,
//   testAuthAndEndpoint,
// };
