const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(payload.user.id).select('-password');
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });

    req.user = { id: user._id, ...user.toObject() };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

module.exports = auth;
