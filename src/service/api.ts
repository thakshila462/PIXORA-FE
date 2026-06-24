import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL:"https://pixora-be-tau.vercel.app/api/v1"
});

// Public endpoints
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      config.url?.includes(url)
    );

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (!isPublic && token) {
      config.headers.set("Authorization", `Bearer ${token}`);
      config.headers.set("x-access-token", token);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;