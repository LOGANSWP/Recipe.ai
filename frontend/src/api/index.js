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

    const { status, data } = error.response;

    if (status === 401) {
      message.error("Invalid token");

      auth.signOut();
      window.location.href = "/login";
    } else if (status === 403) {
      message.error("No permission");
    } else if (status === 500) {
      message.error("Internal server error");
    } else {
      message.error(data?.message || "Request fail");
    }

    return Promise.reject(error);
  }
);

export default api;
