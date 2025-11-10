import axios from "axios";

const isLocalhost = window.location.hostname.includes("localhost");

const API = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api"
    : "https://talentforge-w4t2.onrender.com/api",
});

API.defaults.withCredentials = true;

console.log("🌍 Active API Base URL:", API.defaults.baseURL);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
