import React, { useState } from "react";
import { FaUser, FaKey, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { MdLightbulb } from "react-icons/md";

export default function Profile() {
  // Profile state
  const [profile, setProfile] = useState({
    name: "User Name",
    email: "user@example.com",
    timezone: "UTC-5 (Eastern Time)",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });

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

  // Profile handlers
  const handleEditProfile = () => {
    setTempProfile({ ...profile });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile({ ...tempProfile });
    setIsEditingProfile(false);
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
                  className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <FaSave /> Save
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
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
      </div>
    </main>
  );
}

