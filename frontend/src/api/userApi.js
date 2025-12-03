import api from "./index";

const getUser = (userId) => {
  return api.get(`/api/user/user?id=${userId}`);
};

export {
  getUser,
};
