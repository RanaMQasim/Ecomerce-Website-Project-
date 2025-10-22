const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/ordersController');

router.post('/', createOrder);

router.get('/my', getMyOrders);

router.get('/', getAllOrders);

router.patch('/:id/status', updateOrderStatus);

module.exports = router;