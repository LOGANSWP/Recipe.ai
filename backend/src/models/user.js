import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firebaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
