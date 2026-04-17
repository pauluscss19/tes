import axios from "axios";

const apiCompany = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

apiCompany.interceptors.request.use((config) => {
  // Token company disimpan dengan key berbeda dari token intern
  const token = localStorage.getItem("company_token") 
             || localStorage.getItem("token"); // fallback kalau pakai key sama

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