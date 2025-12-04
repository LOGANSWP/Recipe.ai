import React, { useState, useRef } from "react";
import { FaTimes, FaCheck, FaCamera, FaUpload } from "react-icons/fa";
import { message } from "antd";
import { PRESET_AVATARS } from "../assets/avatars";

export default function AvatarSelector({ currentAvatar, onSelect, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleSelectPreset = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setUploadedFile(null);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error('Image size must be less than 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedAvatar(reader.result);
      setUploadedFile(file);
      message.success('Image uploaded successfully!');
    };
    reader.onerror = () => {
      message.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = async () => {
    try {
      setIsSaving(true);
      await onSelect(selectedAvatar);
      // Only close if save was successful
      onClose();
    } catch (error) {
      console.error("Failed to save avatar:", error);
      // Keep modal open so user can retry
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Avatar</h2>
            <p className="text-green-100 text-sm mt-1">
              Select from our collection or add a custom one
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Current Selection Preview */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                alt="Selected avatar"
                className="w-24 h-24 rounded-full border-4 border-green-500 shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                <FaCamera className="text-sm" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Current Selection</p>
              <p className="text-gray-800 font-semibold text-lg">
                {uploadedFile ? uploadedFile.name : selectedAvatar ? "Preset Avatar" : "Default Avatar"}
              </p>
              {uploadedFile && (
                <p className="text-gray-500 text-xs mt-1">
                  Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Upload Local Image */}
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-lg transition-all hover:shadow-xl"
            >
              <FaUpload className="text-lg" />
              <span>Upload Your Own Image</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or choose a preset</span>
            </div>
          </div>

          {/* Preset Avatars Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preset Avatars
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectPreset(avatar.url)}
                  className={`relative rounded-full overflow-hidden border-4 transition-all hover:scale-110 hover:shadow-lg ${
                    selectedAvatar === avatar.url && !uploadedFile
                      ? "border-green-500 ring-4 ring-green-200"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={`Avatar ${avatar.id}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar === avatar.url && !uploadedFile && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                      <FaCheck className="text-white text-2xl drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Confirm Selection</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

