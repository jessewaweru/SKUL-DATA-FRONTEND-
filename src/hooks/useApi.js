import axios from "axios";

// const BASE_URL = "http://localhost:8000"; // or your deployed backend base URL

// export const useApi = () => {
//   const token = localStorage.getItem("accessToken"); // or however you're storing JWTs

//   const instance = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       Authorization: token ? `Bearer ${token}` : undefined,
//       "Content-Type": "application/json",
//     },
//   });

//   return instance;
// };

// useApi.js
// Use Vite's environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useApi = () => {
  const token = localStorage.getItem("accessToken");

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for CORS with credentials
  });

  // Add interceptors for better error handling
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login if needed
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return {
    // Regular API calls
    get: (url, config) => instance.get(url, config),
    post: (url, data, config) => instance.post(url, data, config),
    patch: (url, data, config) => instance.patch(url, data, config),
    delete: (url, config) => instance.delete(url, config),
    put: (url, data, config) => instance.put(url, data, config),

    // Special methods for file operations
    upload: (url, formData, onUploadProgress) => {
      return instance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
    },
    download: (url) => {
      return instance.get(url, {
        responseType: "blob",
      });
    },
  };
};
