import axios from "axios";

// ✅ Detect backend URL
const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : import.meta.env.VITE_API_URL,
});

// ✅ Token attach
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
console.log("🌍 API base URL:", import.meta.env.VITE_API_URL);

// ✅ Token expiry handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ✅ API routes
export const profileAPI = {
  getMyProfile: (id) => API.get(`/profile/me/${id}`),
  getProfileById: (id) => API.get(`/profile/${id}`),
  updateProfile: (id, data) => API.put(`/profile/update/${id}`, data),
  searchProfiles: (query) => API.get(`/profile/search?q=${query}`),
};

export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
};

export default API;
