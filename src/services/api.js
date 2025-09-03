// import axios from "axios";

// // Use Vite's environment variable
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// console.log("API Base URL:", BASE_URL); // For debugging

// // Create axios instance
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Important for CORS
//   timeout: 10000, // 10 second timeout
// });

// // Add request interceptor to handle authentication
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     // Add CSRF token if available (for Django)
//     const csrfToken = document.querySelector(
//       "[name=csrfmiddlewaretoken]"
//     )?.value;
//     if (csrfToken) {
//       config.headers["X-CSRFToken"] = csrfToken;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response || error.message);

//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       // Optionally redirect to login
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

// src/services/api.js
// src/services/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL, // Remove /api/ from baseURL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

// // Enhanced request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     // Skip auth for token endpoints
//     if (config.url.includes("/token/")) {
//       return config;
//     }

//     // Redirect to login if no token (except for token endpoints)
//     if (!token) {
//       console.error("No token - redirecting to login");
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//       return Promise.reject(new Error("No token available"));
//     }

//     // Add auth header if token exists
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Add /api/ prefix to all non-token endpoints
//     if (!config.url.startsWith("/api/") && !config.url.includes("/token/")) {
//       config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
//     }

//     // Log request for debugging
//     console.log(`Making request to ${config.baseURL}${config.url}`, {
//       method: config.method,
//       data: config.data,
//       params: config.params,
//     });

//     return config;
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// services/api.js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Skip auth for token endpoints
    if (config.url.includes("/token/")) {
      return config;
    }

    // Ensure /api/ prefix is added correctly
    if (
      !config.url.startsWith("http") &&
      !config.url.startsWith("/api/") &&
      !config.url.includes("/token/")
    ) {
      config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details
    if (originalRequest) {
      console.error("API Error:", {
        url: originalRequest.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("API Error:", error);
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      // Skip if already on login page
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      }

      if (originalRequest) originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        // Use the full URL for token refresh
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("accessToken", response.data.access);
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        }

        console.log("Token refreshed, retrying original request");
        return api(originalRequest || error.config);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other error statuses
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Forbidden access - insufficient permissions");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error occurred");
          break;
        default:
          console.error("Unhandled API error");
      }
    } else if (error.request) {
      console.error("No response received - network error");
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
