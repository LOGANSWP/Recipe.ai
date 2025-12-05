import mongoose from "mongoose";
import util from "util";

import Ingredient from "../models/Ingredient.js";
import Kitchenware from "../models/Kitchenware.js";
import Plan from "../models/Plan.js";
import Recommendation from "../models/Recommendation.js";
import Prompt from "../models/Prompt.js";
import Recipe from "../models/Recipe.js"

import { success, createSuccess, deleteSuccess, forbidden, badRequest, internalError } from "../utils/responseTemplete.js";
import { interactCreatePlan } from "../utils/geminiClient.js";
import { GEMINI_RETRY_NUM, CREATE_PLAN_USER_PROMPT_TEMPLATE } from "../config.js";

const getPlanList = async (req, res) => {
  const { user } = req;

  const planList = await Plan.find({ userId: user._id }).sort({ createdAt: -1 });
  return success(res, "get plan list success", planList);
};

const postCreatePlan = async (req, res) => {
  const { user } = req;
  const { title, tags, prompt, mealType, peopleNums, timeLimitMinutes } = req.body;

  const now = new Date();
  const availableIngredients = await Ingredient.find({
    userId: user._id,
    expirationDate: { $gt: now },
  });
  if (availableIngredients.length === 0) {
    return success(res, "It appears there are no available ingredients. Please go to the inventory page to add some.", false);
  }
  const availableKitchenwares = await Kitchenware.find({ userId: user._id });
  if (availableKitchenwares.length === 0) {
    return success(res, "It appears there are no available kitchenware. Please go to the inventory page to add some.", false);
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const createdPlan = await Plan.create({
      userId: user._id,
      title,
      tags,
      prompt,
      mealType,
      peopleNums,
      timeLimitMinutes,
    });

    if (prompt) {
      const existingPrompt = await Prompt.findOne({ userId: user._id, text: prompt });
      if (existingPrompt) {
        await Prompt.findByIdAndUpdate(
          existingPrompt._id,
          { frequency: existingPrompt.frequency + 1 },
          { new: true, runValidators: true, session },
        );
      } else {
        const newPrompt = {
          userId: user._id,
          text: prompt,
        };
        await Prompt.create([newPrompt], { session });
      }
    }

    // asynchronously call LLM to generate recipes (might be slow)
    createRecipesByLLM(user, createdPlan, availableIngredients, availableKitchenwares);

    await session.commitTransaction();
    return createSuccess(res, "create plan success", createdPlan);
  } catch (err) {
    console.error(err);
    if (session) {
      await session.abortTransaction();
    }
    return internalError(res);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const createRecipesByLLM = async (user, plan, ingredients, kitchenwares) => {
  const userPrompt = util.format(CREATE_PLAN_USER_PROMPT_TEMPLATE, user, plan, ingredients, kitchenwares);
  // console.log("userPrompt", userPrompt);
  let recipes = null;
  for (let _ = 0; _ < GEMINI_RETRY_NUM; _++) {
    try {
      const recipesJson = await interactCreatePlan(userPrompt);
      // console.log("recipesJson", recipesJson);
      recipes = JSON.parse(recipesJson.replaceAll("```json", "").replaceAll("```", ""));
      if (recipes !== null && Array.isArray(recipes)) {
        break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (recipes === null || !Array.isArray(recipes)) {
    await Plan.findByIdAndUpdate(
      plan._id,
      { status: "fail" },
      { new: true, runValidators: true },
    );
    return;
  }

  // console.log("get recipes success");
  recipes = recipes.map(recipe => ({
    ...recipe,
    userId: user._id,
    planId: plan._id,
  }))

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await Recipe.create(recipes, { session });

    await Plan.findByIdAndUpdate(
      plan._id,
      { status: "success" },
      { new: true, runValidators: true, session },
    );
    await session.commitTransaction();
  } catch (err) {
    console.error(err);
    if (session) {
      await session.abortTransaction();
    }
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const getRecommendationList = async (req, res) => {
  const recommendationList = await Recommendation.find({}).sort({ score: -1 });
  return success(res, "get recommendation List success", recommendationList);
};

const getPromptList = async (req, res) => {
  const { user } = req;

  const promptList = await Prompt.find({ userId: user._id }).sort({ frequency: -1 });
  return success(res, "get prompt list success", promptList);
};

const getPlan = async (req, res) => {
  const { user } = req;
  const { id } = req.query;

  const plan = await Plan.findById(id);
  if (!plan.userId.equals(user._id)) {
    return forbidden(res, "you have no access to this plan");
  }

  return success(res, "get plan success", plan);
};

const getPlanDetail = async (req, res) => {
  const { user } = req;
  const { id } = req.query;

  const plan = await Plan.findById(id);
  if (!plan.userId.equals(user._id)) {
    return forbidden(res, "you have no access to this plan");
  }

  const recipes = await Recipe.find({ userId: user._id, planId: plan._id });

  const planDetail = {
    plan,
    recipes,
  };
  return success(res, "get plan detail success", planDetail);
};

const postRerunPlan = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  const plan = await Plan.findById(id);
  if (!plan.userId.equals(user._id)) {
    return forbidden(res, "You have no access to this plan");
  }

  if (plan.status !== "fail") {
    return badRequest(res, "Only plans with status [fail] can rerun");
  }

  const now = new Date();
  const availableIngredients = await Ingredient.find({
    userId: user._id,
    expirationDate: { $gt: now },
  });
  if (availableIngredients.length === 0) {
    return success(res, "It appears there are no available ingredients. Please go to the inventory page to add some.");
  }
  const availableKitchenwares = await Kitchenware.find({ userId: user._id });
  if (availableKitchenwares.length === 0) {
    return success(res, "It appears there are no available kitchenware. Please go to the inventory page to add some.");
  }

  const updatedPlan = await Plan.findByIdAndUpdate(
    plan._id,
    { status: "waiting" },
    { new: true, runValidators: true },
  );

  createRecipesByLLM(user, updatedPlan, availableIngredients, availableKitchenwares);

  return success(res, "rerun plan success", updatedPlan);
};

const postDeletePlan = async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  const plan = await Plan.findById(id);
  if (!plan.userId.equals(user._id)) {
    return forbidden(res, "You have no access to this plan");
  }

  if (plan.status === "waiting") {
    return badRequest(res, "The plan is still running, please try later");
  }

  await Plan.findByIdAndDelete(id);
  return deleteSuccess(res, "delete plan success");
};

// update plan could be complicated, it's better to delete the old one and then create a new one
export {
  getPlanList,
  postCreatePlan,
  getRecommendationList,
  getPromptList,
  getPlan,
  getPlanDetail,
  postRerunPlan,
  postDeletePlan,
};
