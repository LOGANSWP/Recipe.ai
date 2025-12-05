import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    img: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

export default Recommendation;
