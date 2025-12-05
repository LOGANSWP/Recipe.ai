import axios from "axios";
import { message } from "antd";

import auth from "../auth/firebase";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    message.error("Send request fail");
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (!error.response) {
      message.error("Network error");
      return Promise.reject(error);
    }

    const { status, data, config } = error.response;

    // Don't show error messages for certain expected errors
    // e.g., fetching user data during registration flow
    const isSilentEndpoint = config.url?.includes('/user/my/user');
    const shouldShowError = !isSilentEndpoint || status !== 404;

    if (status === 401) {
      if (shouldShowError) {
        message.error("Invalid token");
      }
      // Only sign out and redirect if user is currently authenticated
      // This prevents issues during page refresh when token is being loaded
      if (auth.currentUser) {
        auth.signOut();
        window.location.href = "/unauthorized";
      }
    } else if (status === 403) {
      if (shouldShowError) {
        message.error("No permission");
      }
      if (auth.currentUser) {
        auth.signOut();
        window.location.href = "/forbidden";
      }
    } else if (status === 404) {
      // For user endpoints, 404 might be expected (e.g., during registration)
      if (shouldShowError) {
        message.error(data?.message || "Not found");
      }
    } else if (status === 500) {
      if (shouldShowError) {
        message.error("Internal server error");
      }
    } else {
      if (shouldShowError) {
        message.error(data?.message || "Request fail");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
