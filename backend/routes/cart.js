const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateItem,
  removeItem,
  mergeCart,
  clearCart
} = require('../controllers/cartController');
const auth = require('../middlewares/auth');

router.get('/', auth, getCart);

router.post('/item', auth, addToCart);

router.put('/item', auth, updateItem);

router.delete('/item', auth, removeItem);

router.post('/merge', auth, mergeCart);

router.post('/clear', auth, clearCart);

module.exports = router;