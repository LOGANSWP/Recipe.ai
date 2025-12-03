import axios from "axios";

import { auth } from "../auth//firebaseAuth";
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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.error("Invalid token");

        // TODO: sign out and redirect
        // auth.signOut();
        // window.location.href = "/login";
      }
      if (status === 403) {
        console.error("No permission");
      }

      if (status >= 500) {
        console.error("Internal server error");
      }
    } else {
      console.error("Network error");
    }

    return Promise.reject(error);
  }
);

export default api;
