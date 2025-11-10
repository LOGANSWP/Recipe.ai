// --- Small Item Card Component ---

/**
 * Calculates the number of days until expiration.
 * Returns a small positive number for "today" or "expired" to prioritize sorting.
 */
export const getDaysUntilExpiry = (dateString) => {
  if (!dateString) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 0; // Expired or expiring today
  return diffDays;
};

/**
 * Gets the color styling for the expiration badge.
 */
const getExpiryColor = (days) => {
  if (days === 0) {
    return "bg-red-100 text-red-800 border-red-300"; // Expired
  }
  if (days <= 3) {
    return "bg-orange-100 text-orange-800 border-orange-300"; // Expiring soon
  }
  if (days <= 7) {
    return "bg-yellow-100 text-yellow-800 border-yellow-300"; // Expiring this week
  }
  return "bg-gray-100 text-gray-800 border-gray-300"; // Safe
};

export default function InventoryItemCard({ item, onClick, type }) {
  const isIngredient = type === "ingredient";
  const days = isIngredient ? getDaysUntilExpiry(item.expiration_date) : 999;

  return (
    <button
      onClick={onClick}
      className="relative bg-white shadow-md rounded-lg overflow-hidden w-full 
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 
                 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
    >
      <img
        src={item.picture}
        alt={item.name}
        className="w-full h-32 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x200/cccccc/333333?text=Image+Missing";
        }}
      />
      <div className="p-3 text-left">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {item.name}
        </h3>
      </div>

      {/* Expiration Badge for Ingredients */}
      {isIngredient && days <= 7 && (
        <div
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium border ${getExpiryColor(
            days
          )}`}
        >
          {days === 0 ? "Expired" : `Expires in ${days}d`}
        </div>
      )}
    </button>
  );
}
