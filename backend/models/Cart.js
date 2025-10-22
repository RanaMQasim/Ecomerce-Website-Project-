const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    name: { type: String },
    images: [{ url: String, alt: String }], 
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot exceed 100"],
      default: 1,
    },
    selectedSize: { type: String, trim: true, default: "" },
    price: {
      type: Number,
      required: [true, "Price at time of addition is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: { type: Number, min: [0, "Discount price cannot be negative"], default: null },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
);

CartSchema.methods.recalculateSubtotal = function () {
  return this.items.reduce((acc, it) => {
    const unit = (it.discountPrice != null && it.discountPrice < it.price) ? it.discountPrice : it.price;
    return acc + (Number(unit || 0) * Number(it.quantity || 0));
  }, 0);
};

CartSchema.methods.findItemIndex = function (productId, selectedSize = "") {
  return this.items.findIndex(
    (it) => String(it.product) === String(productId) && (it.selectedSize || "") === (selectedSize || "")
  );
};

CartSchema.methods.addOrIncrementItem = function (payload) {
  const productId = payload.product;
  const selectedSize = payload.selectedSize || "";
  const qty = Number(payload.quantity || 1);
  const idx = this.findItemIndex(productId, selectedSize);

  if (idx > -1) {
    this.items[idx].quantity = Math.min(100, (this.items[idx].quantity || 0) + qty);
  } else {
    this.items.push({
      product: productId,
      name: payload.name || undefined,
      images: payload.images || [],
      price: Number(payload.price || 0),
      discountPrice: payload.discountPrice != null ? Number(payload.discountPrice) : null,
      quantity: qty,
      selectedSize
    });
  }
  this.markModified("items");
  return this;
};
CartSchema.methods.updateItemQuantity = function (productId, selectedSize = "", newQty) {
  const idx = this.findItemIndex(productId, selectedSize);
  if (idx === -1) return this;
  const q = Math.max(0, Math.min(100, Number(newQty || 0)));
  if (q === 0) {
    this.items.splice(idx, 1);
  } else {
    this.items[idx].quantity = q;
  }
  this.markModified("items");
  return this;
};

CartSchema.methods.removeItem = function (productId, selectedSize = "") {
  this.items = this.items.filter(
    (it) => !(String(it.product) === String(productId) && (it.selectedSize || "") === (selectedSize || ""))
  );
  this.markModified("items");
  return this;
};

CartSchema.methods.mergeGuestItems = function (guestItems = []) {
  for (const g of guestItems) {
    if (!g || !g.product) continue;
    const idx = this.findItemIndex(g.product, g.selectedSize || "");
    if (idx > -1) {
      this.items[idx].quantity = Math.min(100, (this.items[idx].quantity || 0) + (Number(g.quantity) || 0));
    } else {
      this.items.push({
        product: g.product,
        name: g.name || undefined,
        images: g.images || [],
        price: Number(g.price || 0),
        discountPrice: g.discountPrice != null ? Number(g.discountPrice) : null,
        quantity: Number(g.quantity || 0),
        selectedSize: g.selectedSize || ""
      });
    }
  }
  this.markModified("items");
  return this;
};

module.exports = mongoose.model("Cart", CartSchema);
