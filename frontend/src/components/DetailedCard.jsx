import { useState } from "react";
import { MdClose } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

// --- Detailed Card Component ---
export default function DetailedCard({
  item,
  type,
  onClose,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState(item);
  const isIngredient = type === "ingredient";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    // We should show a confirmation modal in a real app
    // For now, just delete directly
    onDelete(item.id, type);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
      >
        {/* Modal Header with Image */}
        <div className="relative">
          <img
            src={formData.picture}
            alt={formData.name}
            className="w-full h-48 object-cover"
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

        {/* Modal Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isIngredient ? "Edit Ingredient" : "Edit Kitchenware"}
          </h2>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Chicken Breast"
              />
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
            <div>
              <label
                htmlFor="picture"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="text"
                name="picture"
                id="picture"
                value={formData.picture}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="https://placehold.co/..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm 
                         text-base font-medium text-white bg-green-600 hover:bg-green-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-none justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm
                         text-base font-medium text-white bg-orange-600 hover:bg-orange-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FaRegTrashCan className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
