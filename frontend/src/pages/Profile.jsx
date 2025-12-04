import React, { useState, useEffect } from "react";
import { FaUser, FaKey, FaEdit, FaSave, FaTimes, FaCamera, FaLock } from "react-icons/fa";
import { MdLightbulb } from "react-icons/md";
import { message } from "antd";
import { getMyUser, updateMyProfile, changePassword } from "../api/userApi";
import { useAuth } from "../auth/AuthContent";
import AvatarSelector from "../components/AvatarSelector";
import { getDefaultAvatar } from "../assets/avatars";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import auth from "../auth/firebase";

export default function Profile() {
  const { updateUserData } = useAuth();
  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    timezone: "UTC-5 (Eastern Time)",
    avatar: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getMyUser();
        const userData = response.data;
        
        const profileData = {
          name: userData.name || "",
          email: userData.email || "",
          timezone: userData.timezone || "UTC-5 (Eastern Time)",
          avatar: userData.avatar || getDefaultAvatar(userData.name || "User"),
        };
        
        setProfile(profileData);
        setTempProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        message.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Preferred prompts state
  const [prompts, setPrompts] = useState([
    "I prefer light and healthy food",
    "Avoid using spicy seasonings",
    "Prioritize seasonal ingredients",
  ]);
  const [isEditingPrompts, setIsEditingPrompts] = useState(false);
  const [tempPrompts, setTempPrompts] = useState([...prompts]);
  const [newPrompt, setNewPrompt] = useState("");

  // API key state
  const [apiKey, setApiKey] = useState("sk-...xxxx1234");
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile handlers
  const handleEditProfile = () => {
    setTempProfile({ ...profile });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Only send changed fields
      const updates = {};
      if (tempProfile.name !== profile.name) updates.name = tempProfile.name;
      if (tempProfile.email !== profile.email) updates.email = tempProfile.email;
      if (tempProfile.timezone !== profile.timezone) updates.timezone = tempProfile.timezone;
      if (tempProfile.avatar !== profile.avatar) updates.avatar = tempProfile.avatar;

      if (Object.keys(updates).length === 0) {
        message.info("No changes to save");
        setIsEditingProfile(false);
        return;
      }

      const response = await updateMyProfile(updates);
      
      // Update local state with server response
      const updatedData = {
        name: response.data.name,
        email: response.data.email,
        timezone: response.data.timezone,
        avatar: response.data.avatar,
      };
      
      setProfile(updatedData);
      setTempProfile(updatedData);
      setIsEditingProfile(false);
      
      // Update global user data in AuthContext
      updateUserData(response.data);
      
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setTempProfile({ ...profile });
    setIsEditingProfile(false);
  };

  // Prompts handlers
  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setTempPrompts([...tempPrompts, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const handleRemovePrompt = (index) => {
    setTempPrompts(tempPrompts.filter((_, i) => i !== index));
  };

  const handleEditPrompts = () => {
    setTempPrompts([...prompts]);
    setIsEditingPrompts(true);
  };

  const handleSavePrompts = () => {
    setPrompts([...tempPrompts]);
    setIsEditingPrompts(false);
  };

  const handleCancelPrompts = () => {
    setTempPrompts([...prompts]);
    setNewPrompt("");
    setIsEditingPrompts(false);
  };

  // API key handlers
  const handleEditApiKey = () => {
    setTempApiKey(apiKey);
    setIsEditingApiKey(true);
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setIsEditingApiKey(false);
    setShowApiKey(false);
  };

  const handleCancelApiKey = () => {
    setTempApiKey(apiKey);
    setIsEditingApiKey(false);
    setShowApiKey(false);
  };

  const maskApiKey = (key) => {
    if (key.length <= 8) return "***";
    return key.slice(0, 7) + "..." + key.slice(-4);
  };

  // Password handlers
  const handleEditPassword = () => {
    setIsChangingPassword(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const handleSavePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      message.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 20) {
      message.error("New password must be 6-20 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      message.error("New password must be different from current password");
      return;
    }

    try {
      setIsSaving(true);

      // Re-authenticate user with current password
      const user = auth.currentUser;
      if (!user || !user.email) {
        message.error("User not found");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      try {
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        message.error("Current password is incorrect");
        return;
      }

      // Call backend to change password
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      message.success("Password changed successfully!");
      handleCancelPassword();
    } catch (error) {
      console.error("Failed to change password:", error);
      message.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar handlers
  const handleSelectAvatar = async (avatarUrl) => {
    try {
      setIsSaving(true);
      
      // Update avatar immediately
      const response = await updateMyProfile({ avatar: avatarUrl });
      
      // Update local state with server response
      const updatedData = {
        name: response.data.name,
        email: response.data.email,
        timezone: response.data.timezone,
        avatar: response.data.avatar,
      };
      
      setProfile(updatedData);
      setTempProfile(updatedData);
      
      // Update global user data in AuthContext
      updateUserData(response.data);
      
      message.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Failed to update avatar:", error);
      message.error("Failed to update avatar");
      throw error; // Re-throw so AvatarSelector knows it failed
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] p-6 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
          Profile Settings
        </h1>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 text-lg">Loading your profile...</p>
          </div>
        ) : (
          <>

        {/* Avatar Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={tempProfile.avatar || getDefaultAvatar(profile.name)}
                alt="User avatar"
                className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg"
              />
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
              >
                <FaCamera className="text-lg" />
              </button>
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Change Avatar
            </button>
          </div>
        </section>

        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-green-600 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaSave /> {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-gray-800 text-lg">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditingProfile ? (
                <>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {tempProfile.email !== profile.email && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Changing your email will update your login credentials. 
                      Use your new email for future logins.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-800 text-lg">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              {isEditingProfile ? (
                <select
                  value={tempProfile.timezone}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, timezone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="UTC-5 (Eastern Time)">
                    UTC-5 (Eastern Time - EST/EDT)
                  </option>
                  <option value="UTC-6 (Central Time)">
                    UTC-6 (Central Time - CST/CDT)
                  </option>
                  <option value="UTC-7 (Mountain Time)">
                    UTC-7 (Mountain Time - MST/MDT)
                  </option>
                  <option value="UTC-8 (Pacific Time)">
                    UTC-8 (Pacific Time - PST/PDT)
                  </option>
                  <option value="UTC-9 (Alaska Time)">
                    UTC-9 (Alaska Time - AKST/AKDT)
                  </option>
                  <option value="UTC-10 (Hawaii-Aleutian Time)">
                    UTC-10 (Hawaii-Aleutian Time - HST)
                  </option>
                </select>
              ) : (
                <p className="text-gray-800 text-lg">{profile.timezone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaLock className="text-green-600 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Password</h2>
            </div>
            {!isChangingPassword ? (
              <button
                onClick={handleEditPassword}
                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSavePassword}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaSave /> {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelPassword}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {!isChangingPassword ? (
            <div className="py-4">
              <p className="text-gray-600">
                Click "Edit" to update your password. You'll need to enter your current password for security verification.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password * (6-20 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordData.newPassword &&
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Passwords do not match
                    </p>
                  )}
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Security Tips:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use a strong password with letters, numbers, and symbols</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Keep your password private and secure</li>
                  </ul>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Preferred Prompts Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MdLightbulb className="text-orange-400 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">Preferred Prompts</h2>
            </div>
            {!isEditingPrompts ? (
              <button
                onClick={handleEditPrompts}
                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSavePrompts}
                  className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCancelPrompts}
                  className="flex items-center gap-2 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {!isEditingPrompts ? (
              prompts.length > 0 ? (
                prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                  >
                    <p className="text-gray-800">{prompt}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No preferred prompts yet. Click edit to add some.
                </p>
              )
            ) : (
              <>
                {tempPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                  >
                    <p className="text-gray-800 flex-1">{prompt}</p>
                    <button
                      onClick={() => handleRemovePrompt(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddPrompt()}
                    placeholder="Add a new preferred prompt..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddPrompt}
                    className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* API Key Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaKey className="text-orange-400 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">API Key Settings</h2>
            </div>
            {!isEditingApiKey ? (
              <button
                onClick={handleEditApiKey}
                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveApiKey}
                  className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCancelApiKey}
                  className="flex items-center gap-2 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            {isEditingApiKey ? (
              <div className="space-y-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showApiKey}
                    onChange={(e) => setShowApiKey(e.target.checked)}
                    className="rounded focus:ring-green-500"
                  />
                  Show API Key
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-gray-800 text-lg font-mono">
                  {maskApiKey(apiKey)}
                </p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Encrypted
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Please keep your API key secure and do not share it with others. This key is used to access Recipe.ai's AI features.
            </p>
          </div>
        </section>
        </>
        )}
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={tempProfile.avatar}
          onSelect={handleSelectAvatar}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </main>
  );
}

