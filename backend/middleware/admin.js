const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'لا يوجد توكن' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    req.userId = decoded.userId;
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح، ليس مدير' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'توكن غير صالح' });
  }
};