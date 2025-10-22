const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createProduct,
  getAllProducts,
  getProduct,
  getPopularProducts,
  getOfferProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/popular', getPopularProducts);
router.get('/offers', getOfferProducts);

router.post('/', upload.array('images', 6), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct); 
router.put('/:id', upload.array('images', 6), updateProduct);
router.delete('/:id', deleteProduct); 

module.exports = router;
