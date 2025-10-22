const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  cartData: { type: Object, default: {} }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);