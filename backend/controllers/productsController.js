const mongoose = require('mongoose');
const Product = require('../models/Product');
const deleteFile = require('../utils/deleteFile');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const images = (req.files || []).map(file => ({
      url: `${BASE_URL}/images/${file.filename}`,
      alt: file.originalname
    }));
    if (images.length) body.images = images;

    const product = new Product({
      ...body,
      user: req.user ? req.user._id : undefined
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' };
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.popular && String(req.query.popular).toLowerCase() === 'true') {
      filters.popular = true;
    }

    const limit = Number(req.query.limit) || 0;
    const query = Product.find(filters).sort({ createdAt: -1 });
    if (limit > 0) query.limit(limit);

    const products = await query.exec();
    res.json({ success: true, products });
  } catch (err) {
    console.error('Get all products error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  const param = req.params.id;
  try {
    if (mongoose.isValidObjectId(param)) {
      const product = await Product.findById(param);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found by ID' });
      }
      return res.json({ success: true, product });
    }

    const products = await Product.find({
      $or: [{ slug: param }, { category: param }]
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found for "${param}"`
      });
    }

    res.json({ success: true, products });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const products = await Product.find({
      category: { $regex: /women/i },
      popular: true
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    if (products.length > 0) return res.json({ success: true, products });

    const fallbackProducts = await Product.find({
      category: { $regex: /women/i }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return res.json({ success: true, products: fallbackProducts });
  } catch (err) {
    console.error('Get popular women products error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOfferProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    let products = await Product.find({
      category: { $regex: /women/i },
      $expr: { $lt: ["$discountPrice", "$price"] }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    if (products.length > 0) return res.json({ success: true, products });

    products = await Product.find({
      category: { $regex: /women/i },
      $or: [{ slug: /offers|sale/i }, { name: /offers|sale/i }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    if (products.length > 0) return res.json({ success: true, products });

    return res.json({ success: true, products: [] });
  } catch (err) {
    console.error('Get offer women products error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.files && req.files.length) {
      (product.images || []).forEach(img => {
        const relative = img.url?.replace(`${BASE_URL}/`, '');
        deleteFile(relative);
      });
      product.images = req.files.map(file => ({
        url: `${BASE_URL}/images/${file.filename}`,
        alt: file.originalname
      }));
    }

    Object.assign(product, req.body, { updatedAt: Date.now() });
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    (product.images || []).forEach(img => {
      const relative = img.url?.replace(`${BASE_URL}/`, '');
      deleteFile(relative);
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  getPopularProducts,
  getOfferProducts,
  updateProduct,
  deleteProduct
};
