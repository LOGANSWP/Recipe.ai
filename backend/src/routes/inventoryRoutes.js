import express from "express"
import { 
  getIngredients, 
  addIngredient, 
  deleteIngredient,
  updateIngredient,
  getKitchenware,
  addKitchenware,
  updateKitchenware,
  deleteKitchenware
} from '../controllers/inventoryController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth());

// Ingredient Routes
router.get('/ingredients', getIngredients);
router.post('/ingredients', addIngredient);
router.put('/ingredients/:id', updateIngredient);
router.delete('/ingredients/:id', deleteIngredient);

// Kitchenware Routes
router.get('/kitchenware', getKitchenware);
router.post('/kitchenware', addKitchenware);
router.put('/kitchenware/:id', updateKitchenware);
router.delete('/kitchenware/:id', deleteKitchenware);

export default router;