import axios from "axios";
import { getAccessToken, getUserRole } from "../utils/authStorage";

function getBaseURL() {
  const role = getUserRole()?.toLowerCase();

  if (role?.includes("company") || role?.includes("mitra")) {
    return import.meta.env.VITE_API_COMPANY_URL;
  }

  if (role?.includes("intern")) {
    return import.meta.env.VITE_API_INTERN_URL;
  }

  if (role?.includes("super") || role?.includes("staff")) {
    return import.meta.env.VITE_API_ADMIN_URL;
  }

  return import.meta.env.VITE_LOGIN_API_URL;
}

const api = axios.create({
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  config.baseURL = getBaseURL();

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;