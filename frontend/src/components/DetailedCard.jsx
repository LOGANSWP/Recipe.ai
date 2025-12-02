import { useState, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";

// --- Detailed Card Component ---
export default function DetailedCard({
  item,
  type,
  onClose,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState(item);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [nameError, setNameError] = useState(""); // new state for validation
  const [isSaving, setIsSaving] = useState(false);
  const blobUrlRef = useRef(null);
  const isIngredient = type === "ingredient";

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  // Validate name field on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      if (!value.trim()) {
        setNameError("Name is required.");
      } else {
        setNameError("");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File is too large (max 2MB).");
      setSelectedFile(null);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    blobUrlRef.current = newPreviewUrl;
    setFormData((prev) => ({ ...prev, picture: newPreviewUrl }));
  };

  const handleRemoveImage = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, picture: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setNameError("Name is required.");
      return;
    }
    setIsSaving(true);
    await onSave(formData, selectedFile);
    setIsSaving(false);
    onClose();
  };

  const isSaveDisabled = !formData.name.trim();

  // Logic to determine if we show delete button:
  // Only show delete if the item has an ID (meaning it exists in the database).
  const showDelete = !!item.id;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={
              formData.picture ||
              "https://placehold.co/400x300/cccccc/333333?text=No+Image"
            }
            alt={formData.name || "Item image"}
            className="w-full h-48 object-cover bg-gray-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x300/cccccc/333333?text=Image+Missing";
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-900 bg-opacity-30 text-white rounded-full p-1.5
                       hover:bg-opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isIngredient ? "Edit Ingredient" : "Edit Kitchenware"}
          </h2>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  nameError ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-green-500 focus:ring-green-500`}
                placeholder="e.g., Chicken Breast"
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., 2 lbs or 1"
              />
            </div>

            {isIngredient && (
              <div>
                <label
                  htmlFor="expiration_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  id="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <label
                htmlFor="picture-upload"
                className="mt-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm
                           text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiUpload className="h-5 w-5 text-gray-500" />
                <span>Upload Image (Max 2MB)</span>
              </label>
              <input
                id="picture-upload"
                name="picture-upload"
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
              />

              {uploadError && (
                <p className="text-red-500 text-xs mt-1">{uploadError}</p>
              )}

              {formData.picture && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaveDisabled || isSaving}
              className={`flex-1 justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                ${
                  isSaveDisabled || isSaving
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            {/* Only show Delete button if the item actually exists in the DB */}
            {showDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(item.id, type);
                  onClose();
                }}
                className="flex-none justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm
                         text-base font-medium text-white bg-orange-600 hover:bg-orange-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FaRegTrashCan className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
