import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8085",
});

// Automatically attach JWT to every outgoing request, if one exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid tokens globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!localStorage.getItem("token");
    const isLoginRequest = error.config?.url?.includes("/api/users/login");
    if (!isLoginRequest && hadToken && error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token invalid/expired — clear it and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;