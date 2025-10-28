// utils/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
// ✅ Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Debug logging
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log("Request data:", config.data);

  return config;
});

// ✅ Handle token expiration and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    console.log("Response data:", response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
    console.error("Error details:", error.response?.data);

    if (error.response?.status === 401) {
      console.log("🔐 Token expired or invalid, redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ✅ Profile API routes
export const profileAPI = {
  getAllProfiles: () => API.get("/profile"),
  getProfile: (userId) => API.get(`/profile/${userId}`),
  updateProfile: (data) => API.post("/profile/update", data),
  followUser: (data) => API.post("/profile/follow", data),
  unfollowUser: (data) => API.post("/profile/unfollow", data),
};

// ✅ (Optional) Auth API routes
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
};

export default API;
