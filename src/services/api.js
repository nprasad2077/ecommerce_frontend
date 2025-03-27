import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // ← Point directly to Django
  withCredentials: false, // We use JWT in headers, so no cookies
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
