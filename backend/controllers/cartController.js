const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, selectedSize, price, discountPrice } = req.body;
    if (!productId || !selectedSize)
      return res.status(400).json({ success: false, message: 'productId and selectedSize are required' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingIndex = cart.items.findIndex(
      item => String(item.product) === String(productId) && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Math.min(100, cart.items[existingIndex].quantity + quantity);
    } else {
      cart.items.push({ product: productId, quantity, selectedSize, price, discountPrice });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, cart, message: 'Item added to cart' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.json({ success: true, cart: { user: userId, items: [] } });
    res.json({ success: true, cart });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, selectedSize, quantity } = req.body;

    if (!productId || !selectedSize || quantity == null)
      return res.status(400).json({ success: false, message: 'productId, selectedSize, and quantity are required' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const idx = cart.items.findIndex(
      i => String(i.product) === String(productId) && i.selectedSize === selectedSize
    );
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });

    cart.items[idx].quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ success: true, cart, message: 'Cart item updated' });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, selectedSize } = req.body;

    if (!productId || !selectedSize)
      return res.status(400).json({ success: false, message: 'productId and selectedSize are required' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => !(String(i.product) === String(productId) && i.selectedSize === selectedSize));
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ success: true, cart, message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove cart item error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const guestItems = req.body.items || [];

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    guestItems.forEach(gi => {
      const idx = cart.items.findIndex(
        i => String(i.product) === String(gi.productId) && i.selectedSize === gi.selectedSize
      );
      if (idx > -1) {
        cart.items[idx].quantity = Math.min(100, cart.items[idx].quantity + (gi.quantity || 1));
      } else {
        cart.items.push({
          product: gi.productId,
          quantity: gi.quantity || 1,
          selectedSize: gi.selectedSize,
          price: gi.price,
          discountPrice: gi.discountPrice
        });
      }
    });

    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, cart, message: 'Cart merged successfully' });
  } catch (err) {
    console.error('Merge cart error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/*
 Clear cart
 POST /api/cart/clear
*/
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }
    res.json({ success: true, cart: { user: userId, items: [] }, message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { addToCart, getCart, updateItem, removeItem, mergeCart, clearCart };
