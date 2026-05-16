import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||"https://playora-toys-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://playora-toys-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

adminAPI.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default API;
