import mongoose from "mongoose";
import util from "util";

import Ingredient from "../models/Ingredient.js";
import Kitchenware from "../models/Kitchenware.js";
import LLMLog from "../models/LLMLog.js";
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

    const newPlan = {
      userId: user._id,
      title,
      tags,
      prompt,
      mealType,
      peopleNums,
      timeLimitMinutes,
    };
    const [createdPlan] = await Plan.create([newPlan], { session });

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
    console.error("postCreatePlan", err);
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

const slimCreateRecipesInputs = (user, plan, ingredients, kitchenwares) => {
  const slimUser = {
    name: user.name,
    email: user.email,
  };
  const silmPlan = {
    title: plan.title,
    tags: plan.tags.map(tag => tag), // get rid of class methods
    prompt: plan.prompt,
    mealType: plan.mealType,
    peopleNums: plan.peopleNums,
    timeLimitMinutes: plan.timeLimitMinutes,
  };
  const slimIngredients = ingredients.map(ingredient => ({
    name: ingredient.name,
    quantity: ingredient.quantity,
    expirationDate: ingredient.expirationDate,
    category: ingredient.category,
  }));
  const slimKitchenwares = kitchenwares.map(kitchenware => ({
    name: kitchenware.name,
    quantity: kitchenware.quantity,
  }));
  return { slimUser, silmPlan, slimIngredients, slimKitchenwares };
};

const validateRecipes = (recipes) => {
  if (!Array.isArray(recipes)) {
    throw new Error("Recipes object is not a array");
  }
  recipes.forEach(recipe => {
    if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.steps)) {
      throw new Error("One recipe object does not have required attribute");
    }
    recipe.ingredients.forEach(ingredient => {
      if (!ingredient.name) {
        throw new Error("One ingredient object does not have required attribute");
      }
    });
    recipe.steps.forEach(step => {
      if (!step.order || !step.text) {
        throw new Error("One step object does not have required attribute");
      }
    });
  });
};

const createRecipesByLLM = async (user, plan, ingredients, kitchenwares) => {
  const { slimUser, silmPlan, slimIngredients, slimKitchenwares } = slimCreateRecipesInputs(user, plan, ingredients, kitchenwares);
  const userPrompt = util.format(CREATE_PLAN_USER_PROMPT_TEMPLATE, slimUser, silmPlan, slimIngredients, slimKitchenwares);

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    let recipesJson = null;
    let recipes = null;
    let success = false;
    for (let _ = 0; _ < GEMINI_RETRY_NUM; _++) {
      try {
        recipesJson = await interactCreatePlan(userPrompt);
        recipes = JSON.parse(recipesJson.replaceAll("```json", "").replaceAll("```", ""));

        validateRecipes(recipes);
        recipes.forEach(recipe => {
          recipe.userId = user._id;
          recipe.planId = plan._id;
        });
        await Recipe.create(recipes, { session, ordered: true });
        await Plan.findByIdAndUpdate(
          plan._id,
          { status: "success" },
          { new: true, runValidators: true, session },
        );

        const newLLMLog = {
          userId: user._id,
          taskName: "createRecipesByLLM",
          userPrompt,
          llmResponse: recipesJson,
        };
        await LLMLog.create([newLLMLog], { session });
        success = true;
      } catch (err) {
        console.error("createRecipesByLLM", err);
        const newLLMLogFail = {
          userId: user._id,
          taskName: "createRecipesByLLM",
          userPrompt,
          llmResponse: recipesJson,
          errorMessage: err.message,
        };
        await LLMLog.create([newLLMLogFail], { session });
      }

      if (success) {
        break;
      }
    }

    if (!success) {
      await Plan.findByIdAndUpdate(
        plan._id,
        { status: "fail" },
        { new: true, runValidators: true, session },
      );
    }

    await session.commitTransaction();
  } catch (err) {
    console.error("createRecipesByLLM", err);
    if (session) {
      await session.abortTransaction();
    }

    await Plan.findByIdAndUpdate(
      plan._id,
      { status: "fail" },
      { new: true, runValidators: true },
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const getRecommendationList = async (req, res) => {
  const recommendationList = await Recommendation.find({}).sort({ score: -1 });
  return success(res, "get recommendation list success", recommendationList);
};

const getRecommendationListRandom = async (req, res) => {
  const { size } = req.query;
  const sizeNumber = Number(size);

  const randomRecommendationList = await Recommendation.aggregate([{ $sample: { size: sizeNumber } }]).sort({ score: -1 });
  return success(res, "get recommendation list random success", randomRecommendationList);
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
    return badRequest(res, "The plan is still running, please try again later");
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();


    await Plan.findByIdAndDelete(id, { session });
    await Recipe.deleteMany({ planId: id }, { session });

    await session.commitTransaction();
    return deleteSuccess(res, "delete plan success");
  } catch (err) {
    console.error("postDeletePlan", err);
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

// update plan could be complicated, it's better to delete the old one and then create a new one
export {
  getPlanList,
  postCreatePlan,
  getRecommendationList,
  getRecommendationListRandom,
  getPromptList,
  getPlan,
  getPlanDetail,
  postRerunPlan,
  postDeletePlan,
};
