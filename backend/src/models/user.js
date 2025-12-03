import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String, default: null },
    lastLogin: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
