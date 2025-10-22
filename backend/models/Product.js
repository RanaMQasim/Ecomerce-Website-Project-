const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: "" }
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value) {
          if (value == null) return true;
          return value < this.price;
        },
        message: "Discount price must be less than regular price"
      }
    },
    discounted: { type: Boolean, default: false },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0
    },
    quantity: { type: Number, min: [0, "Quantity cannot be negative"], default: 1 },
    size: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"],
      required: [true, "At least one size is required"]
    },
    category: { type: String, required: [true, "Category is required"], trim: true },
    images: [ImageSchema],
    isActive: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.discounted = !!(this.discountPrice && this.discountPrice < this.price);
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
