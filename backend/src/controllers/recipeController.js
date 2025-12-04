import Recipe from "../models/Recipe.js";

// Create a new recipe for the authenticated user.
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, imageUrl, servings, totalTimeMin, tags, sourceType, sourceId, ingredients, steps } = req.body;

    if (!title || !steps || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ message: "Title and at least one step are required" });
    }

    const normalizedSteps = steps.map((step, idx) => ({
      order: step.order ?? idx + 1,
      text: step.text?.trim() || "",
      durationMin: step.durationMin ?? null,
    })).filter((s) => s.text.length > 0);

    if (normalizedSteps.length === 0) {
      return res.status(400).json({ message: "Step text is required" });
    }

    const recipe = await Recipe.create({
      userId: req.user._id,
      title: title.trim(),
      description: description || "",
      imageUrl: imageUrl || "",
      servings: servings ?? 1,
      totalTimeMin: totalTimeMin ?? 0,
      tags: tags || [],
      sourceType: sourceType || "ai",
      sourceId: sourceId || null,
      ingredients: (ingredients || []).map((ing) => ({
        name: ing.name?.trim() || "",
        amount: ing.amount || "",
        note: ing.note || "",
      })).filter((ing) => ing.name.length > 0),
      steps: normalizedSteps,
    });

    return res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

// Get a single recipe by id (scoped to current user).
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

// List recipes for current user, newest first.
const listRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

export {
  createRecipe,
  getRecipeById,
  listRecipes,
};
