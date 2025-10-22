const mongoose = require("mongoose");
const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String, default: "" },
    price: { type: Number, required: true }, 
    discountPrice: { type: Number, default: null } 
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String }
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  provider: { type: String }, 
  status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  transactionId: { type: String },
  meta: { type: Object }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    shipping: { type: ShippingSchema, required: true },
    payment: { type: PaymentSchema, default: {} },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending"
    }
  },
  { timestamps: true }
);

OrderSchema.methods.computeTotals = function () {
  const subtotal = this.items.reduce((acc, it) => {
    const unit = (it.discountPrice != null && it.discountPrice < it.price) ? it.discountPrice : it.price;
    return acc + unit * (Number(it.quantity) || 0);
  }, 0);
  this.subtotal = subtotal;
  this.total = Number((subtotal - (this.discount || 0) + (this.shippingFee || 0)).toFixed(2));
  return { subtotal: this.subtotal, total: this.total };
};

module.exports = mongoose.model("Order", OrderSchema);
