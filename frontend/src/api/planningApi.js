// import qs from "querystring";

import api from "./index";

const getPlanList = () => {
  return api.get(`/planning/plan/list`);
};

const postCreatePlan = (payload) => {
  return api.post(`/planning/create/plan`, payload);
};

const postUpdatePlan = (payload) => {
  return api.post(`/planning/update/plan`, payload);
};

const postDeletePlan = (payload) => {
  return api.post(`/planning/update/plan?`, payload);
};

const getRecommendationList = () => {
  return api.get(`/planning/recommendation/list`);
};

const getPromptList = () => {
  return api.get(`/planning/prompt/list`);
};

export {
  getPlanList,
  postCreatePlan,
  postUpdatePlan,
  postDeletePlan,
  getRecommendationList,
  getPromptList,
};
