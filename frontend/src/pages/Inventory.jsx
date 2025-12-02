import React, { useState, useMemo, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuScanText } from "react-icons/lu";
import InventoryItemCard from "../components/InventoryItemCard";
import DetailedCard from "../components/DetailedCard";
import { getDaysUntilExpiry } from "../components/InventoryItemCard";

// --- Helper: Map Backend Data to Frontend Format ---
const mapBackendToFrontend = (item) => ({
  id: item._id, // Map MongoDB _id to the 'id' our frontend expects
  name: item.name,
  quantity: item.quantity,
  expiration_date: item.expirationDate ? item.expirationDate.split("T")[0] : "",
  picture: item.imageUrl,
});

// --- Main Inventory Page Component ---
export default function Inventory() {
  const [ingredients, setIngredients] = useState([]);
  const [kitchenware, setKitchenware] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'ingredient' or 'kitchenware'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const ingRes = await fetch(
        `${import.meta.env.VITE_API_URL}inventory/ingredients`
      );
      const ingData = await ingRes.json();
      if (Array.isArray(ingData))
        setIngredients(ingData.map(mapBackendToFrontend));

      const kitRes = await fetch(
        `${import.meta.env.VITE_API_URL}inventory/kitchenware`
      );
      const kitData = await kitRes.json();
      if (Array.isArray(kitData))
        setKitchenware(kitData.map(mapBackendToFrontend));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoize sorted & filtered ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const daysA = getDaysUntilExpiry(a.expiration_date);
        const daysB = getDaysUntilExpiry(b.expiration_date);
        return daysA - daysB; // Sort by soonest-to-expire first
      });
  }, [ingredients, searchTerm]);

  // --- Event Handlers ---
  const handleCardClick = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalType(null);
  };

  // API Save Action (Create or Update)
  const handleSave = async (updatedItem, file) => {
    // A. Handle Image Logic
    let finalPicture = updatedItem.picture;
    if (file) {
      finalPicture = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    } else if (
      !updatedItem.picture ||
      updatedItem.picture.startsWith("blob:")
    ) {
      const itemName = updatedItem.name
        ? encodeURIComponent(updatedItem.name)
        : "Item";
      finalPicture = `https://placehold.co/300x200/e0f2fe/075985?text=${itemName}`;
    }

    // B. Prepare Payload
    const payload = {
      name: updatedItem.name,
      quantity: updatedItem.quantity,
      imageUrl: finalPicture,
    };
    if (modalType === "ingredient") {
      payload.expirationDate = updatedItem.expiration_date;
      payload.category = "General";
    }

    // C. Determine Endpoint
    // Check if the item has an ID.
    // If NO ID => It is a NEW item (POST).
    // If HAS ID => It is an EXISTING item (PUT).
    const isNewItem = !updatedItem.id;
    const endpoint =
      modalType === "ingredient" ? "/ingredients" : "/kitchenware";
    const method = isNewItem ? "POST" : "PUT";
    const url = isNewItem
      ? `${import.meta.env.VITE_API_URL}inventory${endpoint}`
      : `${import.meta.env.VITE_API_URL}inventory${endpoint}/${updatedItem.id}`;

    // D. Call API
    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // E. Sync with Database
        // Instead of manually updating the state with a fake ID, we reload the data.
        // This ensures our UI is 100% consistent with the Database.
        await fetchData();
      } else {
        console.error("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // API Delete Action
  const handleDelete = async (id, type) => {
    // If for some reason there is no ID, we can't delete from DB.
    if (!id) return;

    const endpoint = type === "ingredient" ? "/ingredients" : "/kitchenware";
    try {
      await fetch(`${import.meta.env.VITE_API_URL}inventory${endpoint}/${id}`, {
        method: "DELETE",
      });
      // Optimistic update for deletion is fine because we know the ID existed
      if (type === "ingredient") {
        setIngredients((prev) => prev.filter((item) => item.id !== id));
      } else {
        setKitchenware((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Add New Item Action
  const handleAddNew = (type) => {
    // We create an EMPTY object without an 'id'.
    // This tells the handleSave function later that this is a NEW item.
    const newItem =
      type === "ingredient"
        ? { name: "", quantity: "", expiration_date: "", picture: "" }
        : { name: "", quantity: "1", picture: "" };

    setSelectedItem(newItem);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Bar: Title, Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <h1 className="text-4xl font-bold text-gray-800">My Inventory</h1>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <input
                  type="search"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading your pantry...</p>
            </div>
          ) : (
            <>
              {/* --- Ingredients Section --- */}
              <section className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  {/* Left: Section title */}
                  <h2 className="text-2xl font-semibold text-green-700">
                    Ingredients
                  </h2>

                  {/* Right: Buttons grouped */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                    {/* Scan Receipt Button */}
                    <button
                      className="flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-lg
                   font-medium shadow-md hover:bg-orange-700 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <LuScanText className="h-5 w-5 mr-2" />
                      Scan Receipt
                    </button>

                    {/* Add Ingredient Button */}
                    <button
                      onClick={() => handleAddNew("ingredient")}
                      className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg
                   font-medium shadow-md hover:bg-green-700 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <FiPlus className="h-5 w-5 mr-2" />
                      Add Ingredient
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredIngredients.map((item) => (
                    <InventoryItemCard
                      key={item.id}
                      item={item}
                      type="ingredient"
                      onClick={() => handleCardClick(item, "ingredient")}
                    />
                  ))}
                </div>
                {filteredIngredients.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                      No ingredients found. Try adding some!
                    </p>
                  </div>
                )}
              </section>

              {/* --- Kitchenware Section --- */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Kitchenware
                  </h2>
                  <button
                    onClick={() => handleAddNew("kitchenware")}
                    className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-lg
                           font-medium shadow-md hover:bg-gray-700 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <FiPlus className="h-5 w-5 mr-2" />
                    Add Kitchenware
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {kitchenware.map((item) => (
                    <InventoryItemCard
                      key={item.id}
                      item={item}
                      type="kitchenware"
                      onClick={() => handleCardClick(item, "kitchenware")}
                    />
                  ))}
                </div>
                {kitchenware.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                      No kitchenware found. Try adding some!
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {/* Modal Portal */}
      {isModalOpen && selectedItem && (
        <DetailedCard
          item={selectedItem}
          type={modalType}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
