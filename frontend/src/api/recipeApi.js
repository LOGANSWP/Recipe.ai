import api from "./index";

const listRecipes = () => api.get("/recipes");

const getRecipeById = (id) => api.get(`/recipes/${id}`);

const createRecipe = (payload) => api.post("/recipes", payload);

export {
  listRecipes,
  getRecipeById,
  createRecipe,
};
