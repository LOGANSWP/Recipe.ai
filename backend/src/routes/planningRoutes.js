import express from "express";

import {
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
} from "../controllers/planningController.js";
import requireAuth from "../middleware/requireAuth.js";

const planningRouter = express.Router();

planningRouter.get("/plan/list", requireAuth(), getPlanList);
planningRouter.post("/create/plan", requireAuth(), postCreatePlan);
planningRouter.get("/recommendation/list", requireAuth(), getRecommendationList);
planningRouter.get("/recommendation/list/random", requireAuth(), getRecommendationListRandom);
planningRouter.get("/prompt/list", requireAuth(), getPromptList);

// update plan could be complicated, it's better to delete the old one and then create a new one
planningRouter.get("/plan", requireAuth(), getPlan);
planningRouter.get("/plan/detail", requireAuth(), getPlanDetail);
planningRouter.post("/rerun/plan", requireAuth(), postRerunPlan);
planningRouter.post("/edit/plan", requireAuth(), postEditPlan);
planningRouter.post("/update/plan", requireAuth(), postUpdatePlan);
planningRouter.post("/delete/plan", requireAuth(), postDeletePlan);

export default planningRouter;
