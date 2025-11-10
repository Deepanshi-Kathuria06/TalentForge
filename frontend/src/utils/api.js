import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : import.meta.env.VITE_API_URL || "https://talentforge-w4t2.onrender.com/api",
});

console.log("🌍 API base URL:", import.meta.env.VITE_API_URL || "https://talentforge-w4t2.onrender.com/api");

// ✅ Token attach
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
