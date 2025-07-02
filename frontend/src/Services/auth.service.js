import axios from "axios";
import { notification } from "antd";

// Base URL for API calls - use proxy in development
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use proxy in development
  : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000');

// Create axios instance with default config
const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create public API client for routes that don't require authentication
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with token refresh
authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (refreshToken) {
          // Try to refresh the token
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken
          });

          if (refreshResponse.data.success) {
            const { token, refresh_token } = refreshResponse.data;
            
            // Update tokens in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refresh_token);
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            // Retry the original request
            return authApiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }

      // If refresh failed or no refresh token, clear auth data but don't redirect
      // Let the component handle the 401 error
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
    }

    return Promise.reject(error);
  }
);

// Function to handle token expiration
const handleTokenExpired = () => {
  // Clear all authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token");

  // Show notification to user
  notification.warning({
    message: "Phiên đăng nhập hết hạn",
    description: "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
    duration: 3,
  });

  // Redirect to login page
  window.location.href = "/login";
};

// Function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Function to get current user data
const getCurrentUser = () => {
  try {
    let userData = localStorage.getItem("user");
    if (!userData) {
      // Nếu chưa có user trong localStorage, thử lấy từ token
      const token = localStorage.getItem("token");
      if (token) {
        // Giải mã payload của JWT (không kiểm tra chữ ký)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.user) {
          userData = JSON.stringify(payload.user);
          localStorage.setItem("user", userData);
        } else if (payload && payload.email) {
          userData = JSON.stringify(payload);
          localStorage.setItem("user", userData);
        }
      }
    }
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Function to logout user
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token");
  
  notification.success({
    message: "Đăng xuất thành công",
    description: "Bạn đã được đăng xuất khỏi hệ thống.",
    duration: 2,
  });

  window.location.href = "/login";
};

// Function to validate token and get user info
const validateToken = async () => {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return { isValid: false, user: null };
    }

    const user = JSON.parse(userData);
    
    // Check if we have a recent validation (within 5 minutes)
    const lastValidation = localStorage.getItem('lastTokenValidation');
    const now = Date.now();
    
    if (lastValidation && (now - parseInt(lastValidation)) < 5 * 60 * 1000) {
      // Use cached validation
      return { isValid: true, user: user };
    }
    
    // Try to get user info from server to validate token
    const response = await authApiClient.get(`/user/getUserByEmail?email=${encodeURIComponent(user.email)}`);
    
    if (response.data && response.data.user) {
      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem('lastTokenValidation', now.toString());
      return { isValid: true, user: response.data.user };
    } else {
      return { isValid: false, user: null };
    }
  } catch (error) {
    console.error("❌ Token validation failed:", error);
    return { isValid: false, user: null };
  }
};

// Export the auth client and utility functions
export {
  authApiClient,
  publicApiClient,
  handleTokenExpired,
  isAuthenticated,
  getCurrentUser,
  logout,
  validateToken
};