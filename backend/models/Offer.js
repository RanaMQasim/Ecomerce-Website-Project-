const mongoose = require("mongoose");
const OfferSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Offer code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Offer code must be at least 3 characters long"],
      maxlength: [20, "Offer code cannot exceed 20 characters"],
    },

    type: {
      type: String,
      enum: ["percent", "fixed"],
      required: [true, "Offer type is required"],
    },

    value: {
      type: Number,
      required: [true, "Offer value is required"],
      min: [0, "Offer value cannot be negative"],
    },

    appliesTo: {
      type: String,
      enum: ["product", "category", "all"],
      default: "all",
    },

    
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    category: { type: String, trim: true },

    startAt: { type: Date, default: Date.now },
    endAt: { type: Date },
    active: { type: Boolean, default: true },

    description: { type: String, trim: true, maxlength: 200 },

    usageLimit: { type: Number, default: null }, 
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OfferSchema.methods.isCurrentlyValid = function () {
  const now = new Date();
  const withinStart = !this.startAt || now >= this.startAt;
  const withinEnd = !this.endAt || now <= this.endAt;
  const notExpired = this.active && withinStart && withinEnd;
  const withinUsage = !this.usageLimit || this.usedCount < this.usageLimit;
  return notExpired && withinUsage;
};

OfferSchema.methods.applyDiscount = function (price) {
  if (!price || price <= 0) return price;
  if (!this.isCurrentlyValid()) return price;

  let discounted = price;
  if (this.type === "percent") {
    discounted = price - (price * this.value) / 100;
  } else if (this.type === "fixed") {
    discounted = Math.max(0, price - this.value);
  }
  return Number(discounted.toFixed(2));
};

module.exports = mongoose.model("Offer", OfferSchema);
