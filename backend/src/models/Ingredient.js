import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Please add a quantity']
  },
  expirationDate: {
    type: Date,
    required: false
  },
  imageUrl: {
    type: String, // Can store URL or Base64 string
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  }
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", IngredientSchema)

export default Ingredient