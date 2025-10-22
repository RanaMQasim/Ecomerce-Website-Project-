const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectDB();

const uploadPath = process.env.UPLOAD_PATH || 'upload/images';
app.use('/images', express.static(path.join(__dirname, uploadPath)));

console.log('typeof authRoutes:', typeof authRoutes);
console.log('typeof productRoutes:', typeof productRoutes);
console.log('typeof cartRoutes:', typeof cartRoutes);
console.log('typeof orderRoutes:', typeof orderRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.post('/api/upload', (req, res) => {
  res.status(200).json({ success: true, msg: 'Use /api/products with multer to upload images' });
});

app.get('/', (req, res) => res.send('Express App is Running'));

app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
