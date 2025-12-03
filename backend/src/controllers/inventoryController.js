import Ingredient from '../models/Ingredient.js';
import Kitchenware from '../models/Kitchenware.js';

// --- INGREDIENTS LOGIC ---

// @desc    Get all ingredients for the logged-in user
// @route   GET /api/inventory/ingredients
export const getIngredients = async (req, res) => {
  try {
    // Sort by expiration date (ascending) so expiring items show first
    const ingredients = await Ingredient.find({ userId: req.user.id })
                                        .sort({ expirationDate: 1 }); 
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new ingredient
// @route   POST /api/inventory/ingredients
export const addIngredient = async (req, res) => {
  try {
    const { name, quantity, expirationDate, imageUrl, category } = req.body;

    const ingredient = await Ingredient.create({
      userId: req.user.id, // Comes from auth middleware
      name,
      quantity,
      expirationDate,
      imageUrl,
      category
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an ingredient
// @route   PUT /api/inventory/ingredients/:id
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the item exists AND belongs to the user
    const ingredient = await Ingredient.findOne({ _id: id, userId: req.user.id });

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an ingredient
// @route   DELETE /api/inventory/ingredients/:id
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json({ id: id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- KITCHENWARE LOGIC ---

// @desc    Get all kitchenware
// @route   GET /api/inventory/kitchenware
export const getKitchenware = async (req, res) => {
  try {
    const kitchenware = await Kitchenware.find({ userId: req.user.id });
    res.status(200).json(kitchenware);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new kitchenware
// @route   POST /api/inventory/kitchenware
export const addKitchenware = async (req, res) => {
  try {
    const { name, quantity, imageUrl } = req.body;

    const item = await Kitchenware.create({
      userId: req.user.id,
      name,
      quantity,
      imageUrl
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an kitchenware
// @route   PUT /api/inventory/kitchenware/:id
export const updateKitchenware = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the item exists AND belongs to the user
    const kitchenware = await Kitchenware.findOne({ _id: id, userId: req.user.id });

    if (!kitchenware) {
      return res.status(404).json({ message: 'Kitchenware not found' });
    }

    const updatedKitchenware = await Kitchenware.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedKitchenware);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete kitchenware
// @route   DELETE /api/inventory/kitchenware/:id
export const deleteKitchenware = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Kitchenware.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ id: id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};