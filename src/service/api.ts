import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Public endpoints
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

    const normalizedHeaders =
      config.headers && typeof (config.headers as any).set === "function"
        ? config.headers
        : new AxiosHeaders(config.headers || {});

    if (!isPublic && token) {
      normalizedHeaders.set("Authorization", `Bearer ${token}`);
      normalizedHeaders.set("x-access-token", token);
    }

    config.headers = normalizedHeaders;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
