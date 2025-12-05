import express from "express";

import {
  createRecipe,
  getRecipeById,
  listRecipes,
} from "../controllers/recipeController.js";
import requireAuth from "../middleware/requireAuth.js";

const recipeRouter = express.Router();

// Recipes are scoped to the authenticated user
recipeRouter.post("/", requireAuth(), createRecipe);
recipeRouter.get("/", requireAuth(), listRecipes);
recipeRouter.get("/:id", requireAuth(), getRecipeById);

export default recipeRouter;
