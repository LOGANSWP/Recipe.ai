import React, { useState, useMemo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuScanText } from "react-icons/lu";
import InventoryItemCard from "../components/InventoryItemCard";
import DetailedCard from "../components/DetailedCard";
import { getDaysUntilExpiry } from "../components/InventoryItemCard";

// --- Mock Data ---
const initialIngredients = [
  {
    id: "i1",
    name: "Chicken Breast",
    quantity: "2 lbs",
    expiration_date: "2025-11-12",
    picture: "https://placehold.co/300x200/f8b4b4/7c2d2d?text=Chicken",
  },
  {
    id: "i2",
    name: "Eggs",
    quantity: "1 dozen",
    expiration_date: "2025-11-18",
    picture: "https://placehold.co/300x200/fef08a/854d0e?text=Eggs",
  },
  {
    id: "i3",
    name: "Milk",
    quantity: "1/2 gallon",
    expiration_date: "2025-11-10",
    picture: "https://placehold.co/300x200/e0f2fe/075985?text=Milk",
  },
  {
    id: "i4",
    name: "Spinach",
    quantity: "1 bag",
    expiration_date: "2025-11-09",
    picture: "https://placehold.co/300x200/bbf7d0/15803d?text=Spinach",
  },
];

const initialKitchenware = [
  {
    id: "k1",
    name: "Air Fryer",
    quantity: "1",
    picture: "https://placehold.co/300x200/d1d5db/1f2937?text=Air+Fryer",
  },
  {
    id: "k2",
    name: "Mixing Bowl",
    quantity: "3",
    picture: "https://placehold.co/300x200/e0e7ff/3730a3?text=Bowl",
  },
  {
    id: "k3",
    name: "Oven",
    quantity: "1",
    picture: "https://placehold.co/300x200/d4d4d4/18181b?text=Oven",
  },
];

// --- Main Inventory Page Component ---
export default function Inventory() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [kitchenware, setKitchenware] = useState(initialKitchenware);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'ingredient' or 'kitchenware'
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // [MODIFIED] Handles saving with file upload logic
  const handleSave = (updatedItem, file) => {
    // This inner function does the actual state update
    const saveItemToState = (itemWithFinalPicture) => {
      if (modalType === "ingredient") {
        setIngredients((prev) => {
          const exists = prev.find(
            (item) => item.id === itemWithFinalPicture.id
          );
          if (exists) {
            return prev.map((item) =>
              item.id === itemWithFinalPicture.id ? itemWithFinalPicture : item
            );
          } else {
            return [...prev, itemWithFinalPicture];
          }
        });
      } else {
        setKitchenware((prev) => {
          const exists = prev.find(
            (item) => item.id === itemWithFinalPicture.id
          );
          if (exists) {
            return prev.map((item) =>
              item.id === itemWithFinalPicture.id ? itemWithFinalPicture : item
            );
          } else {
            return [...prev, itemWithFinalPicture];
          }
        });
      }
    };

    // --- Logic for handling the picture ---

    if (file) {
      // 1. A new file was uploaded
      // Convert to base64 to store in state (simulates upload)
      const reader = new FileReader();
      reader.onloadend = () => {
        const itemWithBase64 = { ...updatedItem, picture: reader.result };
        saveItemToState(itemWithBase64);
      };
      reader.readAsDataURL(file);
    } else {
      // 2. No new file was uploaded
      let itemToSave = { ...updatedItem };

      // If picture is "" (from "Remove Image") or a blob (stale preview),
      // set the default placeholder.
      if (!itemToSave.picture || itemToSave.picture.startsWith("blob:")) {
        const itemName = itemToSave.name
          ? encodeURIComponent(itemToSave.name)
          : "Item";
        itemToSave.picture = `https://placehold.co/300x200/e0f2fe/075985?text=${itemName}`;
      }

      // 3. If picture is a regular http:// URL, it's unchanged.
      // Save item to state immediately
      saveItemToState(itemToSave);
    }
  };

  const handleDelete = (id, type) => {
    if (type === "ingredient") {
      setIngredients((prev) => prev.filter((item) => item.id !== id));
    } else {
      setKitchenware((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddNew = (type) => {
    const newItem =
      type === "ingredient"
        ? {
            id: `i${Date.now()}`,
            name: "",
            quantity: "",
            expiration_date: "",
            picture: "",
          }
        : { id: `k${Date.now()}`, name: "", quantity: "1", picture: "" };

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
          </section>
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
