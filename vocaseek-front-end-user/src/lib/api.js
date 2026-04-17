import axios from "axios";
import { getAccessToken } from "../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Jika payload adalah FormData, hapus Content-Type
  // agar browser otomatis set multipart/form-data + boundary yang benar
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;