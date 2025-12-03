import api from "./index";

const getMyUser = () => {
  return api.get(`/user/my/user`);
};

export {
  getMyUser,
};
