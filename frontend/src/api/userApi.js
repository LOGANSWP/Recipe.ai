import api from "./index";

const getMyUser = () => {
  return api.get(`/user/my/user`);
};

const updateMyProfile = (data) => {
  return api.put(`/user/my/profile`, data);
};

export {
  getMyUser,
  updateMyProfile,
};
