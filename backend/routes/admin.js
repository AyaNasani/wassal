const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');
const adminAuth = require('../middleware/admin');

// جلب الإحصائيات
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      sellProducts: await Product.countDocuments({ type: 'sell' }),
      borrowProducts: await Product.countDocuments({ type: 'borrow' }),
      donateProducts: await Product.countDocuments({ type: 'donate' }),
      pendingProducts: await Product.countDocuments({ status: 'pending' }),
      reports: await Report.countDocuments({ status: 'pending' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب المنتجات المعلقة
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' })
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// الموافقة على منتج
router.put('/approve/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    await Notification.create({
      user: product.seller,
      title: 'تم قبول إعلانك',
      message: `تمت الموافقة على إعلان "${product.title}" وهو متاح للعرض`,
      type: 'product_approved'
    });
    
    res.json({ message: '✅ تمت الموافقة على الإعلان', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// رفض منتج
router.put('/reject/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    await Notification.create({
      user: product.seller,
      title: 'تم رفض إعلانك',
      message: `لم تتم الموافقة على إعلان "${product.title}"`,
      type: 'product_rejected'
    });
    
    res.json({ message: '❌ تم رفض الإعلان', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب جميع المستخدمين
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب البلاغات
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب سجل النشاطات
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;