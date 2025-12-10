import admin from "../auth/firebase.js";

/**
 * Check if string is a valid HTTP(S) URL
 */
export const isHttpUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

/**
 * Check if string is a Base64 data URL
 */
export const isBase64DataUrl = (str) => {
  return str && str.startsWith('data:');
};

/**
 * Build Firebase update data object
 * Filters out Base64 avatars (Firebase doesn't support them)
 */
export const buildFirebaseUpdateData = (user, updates) => {
  const firebaseUpdateData = {};

  // Update email
  if (updates.email && updates.email !== user.email) {
    firebaseUpdateData.email = updates.email;
  }

  // Update display name
  if (updates.name && updates.name !== user.name) {
    firebaseUpdateData.displayName = updates.name;
  }

  // Update photo URL (only for HTTP(S) URLs)
  if (updates.avatar !== undefined && updates.avatar !== user.avatar) {
    if (isHttpUrl(updates.avatar)) {
      firebaseUpdateData.photoURL = updates.avatar;
    } else if (updates.avatar === null || updates.avatar === '') {
      firebaseUpdateData.photoURL = null;
    }
    // Skip Base64 data URLs - Firebase doesn't support them
  }

  return firebaseUpdateData;
};

/**
 * Update Firebase user data
 * Returns true if successful, false if failed
 */
export const updateFirebaseUser = async (firebaseId, updateData) => {
  if (Object.keys(updateData).length === 0) {
    return true; // Nothing to update
  }

  try {
    await admin.auth().updateUser(firebaseId, updateData);
    return true;
  } catch (error) {
    console.error("Failed to update Firebase user:", error);
    throw new Error(`Failed to update user in authentication system: ${error.message}`);
  }
};

