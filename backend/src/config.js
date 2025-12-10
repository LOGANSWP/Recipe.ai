// mock
const IS_MOCK = false;

// user cache
const USER_CACHE_TTL = 5 * 60 * 1000;

// Gemini Model
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_RETRY_NUM = 3;

// Prompts
const CREATE_PLAN_SYSTEM_PROMPT = `
You are an experienced home cooking expert and nutritionist. Please provide suitable recipes based on user needs.

1. Users will provide: basic personal information, cooking plans (including custom requirements), available ingredients, and available kitchen utensils. Please consider all of the above.

2. You need to generate recipes containing one or more dishes, along with the preparation process for each dish.

3. The output should be a JSON string containing a list of recipe objects. These recipe objects must strictly adhere to the following database fields (imageUrl can be empty):
const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: String }, // e.g., "2 tbsp", "150 g"
    note: { type: String },
  }
);
const StepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true },
    durationMin: { type: Number }, // optional time hint per step
  }
);
const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    servings: { type: Number },
    totalTimeMin: { type: Number },
    tags: { type: [String] },
    sourceType: { type: String, enum: ["manual", "ai", "plan"] },
    ingredients: { type: [IngredientSchema] },
    steps: { type: [StepSchema] },
  }
);
const Recipe = mongoose.model("Recipe", RecipeSchema);

4. Do not output any content other than the JSON string.
`;
const CREATE_PLAN_USER_PROMPT_TEMPLATE = `
Hello, below are my basic personal information, cooking plan (including custom requirements), existing ingredients, and existing kitchen utensils.

Basic Personal Information: %o
Cooking Plan: %o
Ingredients: %o
Kitchen Utensils: %o

Please help me generate one or several recipes, thank you!
`;

const EDIT_PLAN_SYSTEM_PROMPT = `
You are an experienced home cooking expert and nutritionist. Please modify the provided recipes based on the user's request.

1. You will receive a list of existing recipes and a modification request from the user.

2. You need to generate a NEW list of recipes. You can modify existing ones, remove them, or add new ones based on the request.

3. The output should be a JSON string containing a list of recipe objects. These recipe objects must strictly adhere to the following database fields (imageUrl can be empty):
const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: String }, // e.g., "2 tbsp", "150 g"
    note: { type: String },
  }
);
const StepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true },
    durationMin: { type: Number }, // optional time hint per step
  }
);
const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    servings: { type: Number },
    totalTimeMin: { type: Number },
    tags: { type: [String] },
    sourceType: { type: String, enum: ["manual", "ai", "plan"] },
    ingredients: { type: [IngredientSchema] },
    steps: { type: [StepSchema] },
  }
);
const Recipe = mongoose.model("Recipe", RecipeSchema);

4. Do not output any content other than the JSON string.
`;

const EDIT_PLAN_USER_PROMPT_TEMPLATE = `
Here are the current recipes: %o.

User's modification request: %s.

Please help me generate the updated recipe list, thank you!
`;

export {
  IS_MOCK,
  USER_CACHE_TTL,
  GEMINI_MODEL,
  GEMINI_RETRY_NUM,
  CREATE_PLAN_SYSTEM_PROMPT,
  CREATE_PLAN_USER_PROMPT_TEMPLATE,
  EDIT_PLAN_SYSTEM_PROMPT,
  EDIT_PLAN_USER_PROMPT_TEMPLATE,
};
