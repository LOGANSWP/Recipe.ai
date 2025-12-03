import api from "./index";

const getUser = (userId) => {
  return api.get(`/user/user?id=${userId}`);
};

export {
  getUser,
};
