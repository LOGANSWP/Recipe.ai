import React, { useState, useMemo, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { LuScanText } from "react-icons/lu";
import InventoryItemCard from "../components/InventoryItemCard";
import InventoryHeader from "../components/InventoryHeader";
import DetailedCard from "../components/DetailedCard";
import { getDaysUntilExpiry } from "../components/InventoryItemCard";
import { INGREDIENT_CATEGORIES } from "../assets/config.js";
import {
  fetchAllIngredients,
  fetchAllKitchenware,
  addOrUpdateInventory,
  deleteInventory,
} from "../api/inventoryApi.js";

// --- Helper: Add Item Card Component ---
const AddItemCard = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="relative bg-white shadow-md rounded-lg overflow-hidden w-full h-full min-h-[11rem] flex flex-col items-center justify-center
               transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 
               focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 group"
  >
    <FiPlus className="h-12 w-12 mb-2 text-gray-300 group-hover:text-green-500 transition-colors" />
    <span className="font-medium text-sm text-gray-400 group-hover:text-green-600 transition-colors">{label}</span>
  </button>
);

// --- Helper: Map Backend Data to Frontend Format ---
const mapBackendToFrontend = (item) => ({
  id: item._id, // Map MongoDB _id to the 'id' our frontend expects
  name: item.name,
  quantity: item.quantity,
  expiration_date: item.expirationDate ? item.expirationDate.split("T")[0] : "",
  category: item.category || "Other",
  picture: item.imageUrl,
});

// --- Main Inventory Page Component ---
export default function Inventory() {
  const [ingredients, setIngredients] = useState([]);
  const [kitchenware, setKitchenware] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'ingredient' or 'kitchenware'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Data from API
  const fetchData = async () => {
    setIsLoading(true);
    const ingData = await fetchAllIngredients();
    if (Array.isArray(ingData))
      setIngredients(ingData.map(mapBackendToFrontend));

    const kitData = await fetchAllKitchenware();
    if (Array.isArray(kitData))
      setKitchenware(kitData.map(mapBackendToFrontend));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoize sorted & filtered ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const daysA = getDaysUntilExpiry(a.expiration_date);
        const daysB = getDaysUntilExpiry(b.expiration_date);
        return daysA - daysB; // Sort by soonest-to-expire first
      });
  }, [ingredients, searchTerm, selectedCategory]);

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
      payload.category = updatedItem.category;
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
      ? `/inventory${endpoint}`
      : `/inventory${endpoint}/${updatedItem.id}`;

    // D. Call API
    const res = await addOrUpdateInventory(method, url, payload);
    await fetchData();
  };

  // API Delete Action
  const handleDelete = async (id, type) => {
    // If for some reason there is no ID, we can't delete from DB.
    if (!id) return;

    const endpoint = type === "ingredient" ? "/ingredients" : "/kitchenware";
    const url = `/inventory${endpoint}/${id}`;
    await deleteInventory(url);
    // Optimistic update for deletion is fine because we know the ID existed
    if (type === "ingredient") {
      setIngredients((prev) => prev.filter((item) => item.id !== id));
    } else {
      setKitchenware((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Add New Item Action
  const handleAddNew = (type) => {
    // We create an EMPTY object without an 'id'.
    // This tells the handleSave function later that this is a NEW item.
    const newItem =
      type === "ingredient"
        ? {
            name: "",
            quantity: "",
            expiration_date: "",
            picture: "",
            category: "Other",
          }
        : { name: "", quantity: "1", picture: "" };

    setSelectedItem(newItem);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <InventoryHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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
                  {/* Left Side: Title & Filter Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
                    <h2 className="text-2xl font-semibold text-green-700 whitespace-nowrap">
                      Ingredients
                    </h2>

                    {/* Category Filter Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap border ${
                          selectedCategory === "All"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        All
                      </button>
                      {INGREDIENT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap border ${
                            selectedCategory === cat
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: Buttons grouped */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  <AddItemCard onClick={() => handleAddNew("ingredient")} label="Add Ingredient" />
                  {filteredIngredients.map((item) => (
                    <InventoryItemCard
                      key={item.id}
                      item={item}
                      type="ingredient"
                      onClick={() => handleCardClick(item, "ingredient")}
                    />
                  ))}
                </div>
                {/* {filteredIngredients.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                      No ingredients found. Try adding some!
                    </p>
                  </div>
                )} */}
              </section>

              {/* --- Kitchenware Section --- */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Kitchenware
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  <AddItemCard onClick={() => handleAddNew("kitchenware")} label="Add Kitchenware" />
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
