const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'لا يوجد توكن، الوصول مرفوض' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    req.userId = decoded.userId;
    next();  // ✅ لازم تكون معرفة
  } catch (error) {
    res.status(401).json({ message: 'توكن غير صالح' });
  }
};