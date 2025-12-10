import User from "../models/User.js";
import { setUserCache } from "../auth/userCache.js";
import admin from "../auth/firebase.js";

const getMyUser = async (req, res) => {
  const { user } = req;
  return res.status(200).json({ message: "Get user success", data: user });
};

const updateMyProfile = async (req, res) => {
  const { user } = req;
  const { name, email, timezone, avatar } = req.body;

  // Build update object with only provided fields
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (timezone !== undefined) updateData.timezone = timezone;
  if (avatar !== undefined) updateData.avatar = avatar;

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  // Update Firebase Authentication if email, name, or avatar changed
  const firebaseUpdateData = {};
  if (email && email !== user.email) {
    firebaseUpdateData.email = email;
  }
  if (name && name !== user.name) {
    firebaseUpdateData.displayName = name;
  }
  // Only update Firebase photoURL if avatar is a valid HTTP(S) URL
  // Firebase doesn't support Base64 data URLs
  if (avatar !== undefined && avatar !== user.avatar) {
    // Check if it's a valid HTTP(S) URL (not Base64)
    if (avatar && (avatar.startsWith('http://') || avatar.startsWith('https://'))) {
      firebaseUpdateData.photoURL = avatar;
    } else if (avatar === null || avatar === '') {
      // Allow clearing the photo
      firebaseUpdateData.photoURL = null;
    }
    // If it's Base64 (starts with 'data:'), skip Firebase update
    // It will still be saved to MongoDB
  }

  // Apply Firebase updates if any
  if (Object.keys(firebaseUpdateData).length > 0) {
    try {
      await admin.auth().updateUser(user.firebaseId, firebaseUpdateData);
    } catch (error) {
      console.error("Failed to update Firebase user:", error);
      return res.status(500).json({ 
        message: "Failed to update user in authentication system",
        error: error.message 
      });
    }
  }

  // Update user in database
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    updateData,
    { new: true, runValidators: true }
  );

  // Update user cache (use firebaseId as key, consistent with requireAuth)
  setUserCache(updatedUser.firebaseId, updatedUser);

  return res.status(200).json({ 
    message: "Profile updated successfully", 
    data: updatedUser 
  });
};

export {
  getMyUser,
  updateMyProfile,
};
