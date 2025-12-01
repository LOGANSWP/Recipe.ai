import mongoose from 'mongoose';

const KitchenwareSchema = new mongoose.Schema({
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
    default: "1"
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Kitchenware = mongoose.model('Kitchenware', KitchenwareSchema);

export default Kitchenware