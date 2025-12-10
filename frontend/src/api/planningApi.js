// import qs from "querystring";

import api from "./index";

const getPlanList = () => {
  return api.get(`/planning/plan/list`);
};

const postCreatePlan = (payload) => {
  return api.post(`/planning/create/plan`, payload);
};

const getRecommendationList = () => {
  return api.get(`/planning/recommendation/list`);
};

const getRecommendationListRandom = (size) => {
  return api.get(`/planning/recommendation/list/random?size=${size}`);
};

const getPromptList = () => {
  return api.get(`/planning/prompt/list`);
};

const getPlan = (planId) => {
  return api.get(`/planning/plan?id=${planId}`);
};

const getPlanDetail = (planId) => {
  return api.get(`/planning/plan/detail?id=${planId}`);
};

const postRerunPlan = (payload) => {
  return api.post(`/planning/rerun/plan`, payload);
};

const postEditPlan = (payload) => {
  return api.post(`/planning/edit/plan`, payload);
};

const postUpdatePlan = (payload) => {
  return api.post(`/planning/update/plan`, payload);
};

const postDeletePlan = (payload) => {
  return api.post(`/planning/delete/plan`, payload);
};

export {
  getPlanList,
  postCreatePlan,
  getRecommendationList,
  getRecommendationListRandom,
  getPromptList,
  getPlan,
  getPlanDetail,
  postRerunPlan,
  postEditPlan,
  postUpdatePlan,
  postDeletePlan,
};
