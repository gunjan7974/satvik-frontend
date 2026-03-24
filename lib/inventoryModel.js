const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    default: 0,
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit (e.g., kg, pcs)'],
    default: 'kg',
  },
  minLevel: {
    type: Number,
    required: [true, 'Please add minimum stock level'],
    default: 5,
  },
  price: {
    type: Number,
    required: [true, 'Please add price per unit'],
    default: 0,
  },
  supplier: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);