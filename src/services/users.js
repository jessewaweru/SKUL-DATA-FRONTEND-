import axios from "axios";

const API_BASE = "/api/users/";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE}roles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const fetchUserSessions = async () => {
  try {
    const response = await axios.get(`${API_BASE}sessions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};

export const fetchAdministrators = async () => {
  try {
    const response = await axios.get(`${API_BASE}administrators/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching administrators:", error);
    throw error;
  }
};

// Add other user-related API calls as needed
