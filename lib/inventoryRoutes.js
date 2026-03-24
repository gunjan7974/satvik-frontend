const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getInventory)
  .post(protect, admin, createInventoryItem);

router.route('/:id')
  .get(protect, admin, getInventoryItem)
  .put(protect, admin, updateInventoryItem)
  .delete(protect, admin, deleteInventoryItem);

module.exports = router;