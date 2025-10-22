const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  const userId = req.userId;
  const { shipping, payment = {}, coupon } = req.body;

  if (!shipping)
    return res.status(400).json({ success: false, message: "Shipping information required" });

  const cart = await Cart.findOne({ user: userId });
  if (!cart || !cart.items.length)
    return res.status(400).json({ success: false, message: "Cart is empty" });

  const orderItems = [];
  let subtotal = 0;

  for (const it of cart.items) {
    const prod = await Product.findById(it.product).lean();
    if (!prod)
      return res.status(400).json({ success: false, message: `Product ${it.product} not found` });

    if (typeof prod.stock === "number" && prod.stock < (it.quantity || 0)) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for ${prod.name}`,
      });
    }

    const itemPrice = it.discountPrice ?? it.price;
    subtotal += itemPrice * it.quantity;

    orderItems.push({
      product: it.product,
      name: it.name || prod.name,
      quantity: it.quantity,
      selectedSize: it.selectedSize || "",
      price: it.price,
      discountPrice: it.discountPrice ?? null,
    });
  }

  const total = subtotal;

  const order = new Order({
    user: userId,
    items: orderItems,
    shipping,
    payment,
    subtotal,
    total,
    status: "pending",
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const it of cart.items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error("Product disappeared");
      prod.stock = Math.max(0, prod.stock - (it.quantity || 0));
      await prod.save({ session });
    }

    await order.save({ session });

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    await order.populate("user", "name email");

    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, message: err.message || "Checkout failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  const userId = req.userId;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, orders });
};

exports.getAllOrders = async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.max(1, Number(req.query.limit || 20));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(),
  ]);

  res.json({ success: true, orders, total, page, limit });
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });

  order.status = status;
  await order.save();
  res.json({ success: true, order });
};