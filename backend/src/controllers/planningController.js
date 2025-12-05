import Plan from "../models/Plan.js";
import Recommendation from "../models/Recommendation.js";
import Prompt from "../models/Prompt.js";

import { success, createSuccess } from "../utils/responseTemplete.js";

const getPlanList = async (req, res) => {
  const { user } = req;

  const planList = await Plan.find({ userId: user.id }).sort({ createdAt: 1 });
  return success(res, "get plan list success", planList);
};

const postCreatePlan = async (req, res) => {
  const { user } = req;
  const { title, tags, prompt, mealType, peopleNums, timeLimitMinutes } = req.body;

  const createdPlan = await Plan.create({
    userId: user.id,
    title,
    tags,
    prompt,
    mealType,
    peopleNums,
    timeLimitMinutes,
  });
  return createSuccess(res, "create plan success", createdPlan);
};

const getRecommendationList = async (req, res) => {
  const recommendationList = await Recommendation.find({});
  return success(res, "get recommendation List success", recommendationList);
};

const getPromptList = async (req, res) => {
  const { user } = req;

  const promptList = await Prompt.find({ userId: user.id });
  return success(res, "get prompt list success", promptList);
};

export {
  getPlanList,
  postCreatePlan,
  getRecommendationList,
  getPromptList,
};
