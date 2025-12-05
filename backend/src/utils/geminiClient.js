import { GoogleGenerativeAI } from "@google/generative-ai";

import { GEMINI_MODEL, CREATE_PLAN_SYSTEM_PROMPT } from "../config.js";

let geminiAI = null;

let createPlanModel = null;

const setGeminiApiKey = (apiKey) => {
  geminiAI = new GoogleGenerativeAI(apiKey);

  createPlanModel = geminiAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: CREATE_PLAN_SYSTEM_PROMPT,
  });
};

const interactCreatePlan = async (userPrompt) => {
  if (!createPlanModel) {
    throw new Error("invalid model");
  }
  const result = await createPlanModel.generateContent(userPrompt);
  return result.response.text();
};

export {
  setGeminiApiKey,
  interactCreatePlan,
};
