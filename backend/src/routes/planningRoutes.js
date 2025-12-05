import express from "express";

import {
  getPlanList,
  postCreatePlan,
  getRecommendationList,
  getPromptList,
} from "../controllers/planningController.js";
import requireAuth from "../middleware/requireAuth.js";

const planningRouter = express.Router();

planningRouter.get("/plan/list", requireAuth(), getPlanList);
planningRouter.post("/create/plan", requireAuth(), postCreatePlan);
planningRouter.get("/recommendation/list", requireAuth(), getRecommendationList);
planningRouter.get("/prompt/list", requireAuth(), getPromptList);

export default planningRouter;
