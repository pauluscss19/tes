import axios from "axios";
import { getAccessToken } from "../utils/authStorage";

const apiCompany = axios.create({
  baseURL: import.meta.env.VITE_API_COMPANY_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

apiCompany.interceptors.request.use((config) => {
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

export default apiCompany;