import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://talentforge-w4t2.onrender.com/api"),
});

console.log("🌍 Active API Base URL:", API.defaults.baseURL);

// ✅ Token attach
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
