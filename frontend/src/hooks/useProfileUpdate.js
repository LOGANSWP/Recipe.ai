import { useState } from "react";
import { message } from "antd";
import { updateMyProfile } from "../api/userApi";
import { useAuth } from "../auth/AuthContent";

/**
 * Custom hook for profile update logic
 * Reduces code duplication and improves maintainability
 */
export const useProfileUpdate = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUserData } = useAuth();

  const updateProfile = async (updates) => {
    try {
      setIsSaving(true);
      const response = await updateMyProfile(updates);
      
      // Update global user data in AuthContext
      updateUserData(response.data);
      
      return response.data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { updateProfile, isSaving };
};

