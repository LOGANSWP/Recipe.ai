import api from "./index";

// User related APIs
const getMyUser = () => {
  return api.get(`/user/my/user`);
};

const updateMyProfile = (data) => {
  return api.put(`/user/my/profile`, data);
};

// Inventory related APIs
const fetchAllIngredients = async () => {
  return await api.get(`/inventory/ingredients`);
};

const fetchAllKitchenware = async () => {
  return await api.get(`/inventory/kitchenware`);
};

const addOrUpdateInventory = async (method, url, payload) => {
  if (method === "POST") {
    return await api.post(url, payload);
  } else if (method === "PUT") {
    return await api.put(url, payload);
  }
};

const deleteInventory = async (url) => {
  return api.delete(url);
};

// Export all functions
export {
  getMyUser,
  updateMyProfile,
  fetchAllIngredients,
  fetchAllKitchenware,
  addOrUpdateInventory,
  deleteInventory,
};