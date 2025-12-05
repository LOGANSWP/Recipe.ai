import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    tags: {
      type: [String],
      default: [],
    },
    prompt: {
      type: String,
      default: "",
      maxlength: 500,
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Brunch", "Lunch", "High Tea", "Dinner", "Night Snack"],
      required: true,
    },
    peopleNums: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    timeLimitMinutes: {
      type: Number,
      min: 1,
      max: 600,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "success", "fail", "closed"],
      default: "waiting",
      required: true,
    },
  },
  { timestamps: true },
);

const Plan = mongoose.model("Plan", PlanSchema);

export default Plan;
