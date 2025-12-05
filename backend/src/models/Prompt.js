import mongoose from "mongoose";

const PreferredPromptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    frequency: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const Prompt = mongoose.model('PreferredPrompt', PreferredPromptSchema);

export default Prompt;
