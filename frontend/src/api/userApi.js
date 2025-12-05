import api from "./index";

// User related APIs
const getMyUser = () => {
  return api.get(`/user/my/user`);
};

const updateMyProfile = (data) => {
  return api.put(`/user/my/profile`, data);
};

const changePassword = (data) => {
  return data;
};

// Export all functions
export {
  getMyUser,
  updateMyProfile,
  changePassword,
};
