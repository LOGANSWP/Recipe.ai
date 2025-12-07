import mongoose from "mongoose";

const LLMLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskName: {
      type: String,
      required: true,
      index: true,
    },
    userPrompt: {
      type: String,
      default: "",
    },
    llmResponse: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    }
  },
  { timestamps: true },
);

const LLMLog = mongoose.model("LLMLog", LLMLogSchema);

export default LLMLog;
