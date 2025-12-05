import mongoose from "mongoose";

// Stores a single generated or saved recipe with full cooking steps.
const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, default: "" }, // e.g., "2 tbsp", "150 g"
    note: { type: String, default: "" },
  },
  { _id: false }
);

const StepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
    durationMin: { type: Number, default: null }, // optional time hint per step
  },
  { _id: false }
);

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    servings: { type: Number, default: 1 },
    totalTimeMin: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    sourceType: { type: String, enum: ["manual", "ai", "plan"], default: "ai" },
    sourceId: { type: String, default: null }, // e.g., planning id or external id
    ingredients: { type: [IngredientSchema], default: [] },
    steps: { type: [StepSchema], default: [] },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
