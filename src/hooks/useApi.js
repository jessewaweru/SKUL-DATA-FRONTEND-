import axios from "axios";

const BASE_URL = "http://localhost:8000"; // or your deployed backend base URL

export const useApi = () => {
  const token = localStorage.getItem("accessToken"); // or however you're storing JWTs

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });

  return instance;
};
