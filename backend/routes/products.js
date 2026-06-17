const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// جلب المنتجات المعتمدة والمتاحة فقط
router.get('/', async (req, res) => {
  try {
    const { search, category, type } = req.query;
    let query = { status: 'approved' }; // ✅ فقط المعتمدة

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name university phone avatar')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب منتج واحد
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name university phone avatar');
    
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    
    product.views += 1;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// إضافة منتج (ينتظر الموافقة)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const product = new Product({
      ...req.body,
      images: imagePaths,
      seller: req.userId,
      sellerName: req.body.sellerName,
      sellerPhone: req.body.sellerPhone,
      status: 'pending'
    });
    
    await product.save();
    
    await Notification.create({
      user: req.userId,
      title: 'إعلان جديد بانتظار الموافقة',
      message: `تم إضافة إعلان "${product.title}" وهو بانتظار مراجعة الإدارة`,
      type: 'new_product'
    });
    
    res.status(201).json({ 
      message: 'تم إضافة الإعلان بنجاح، وهو بانتظار موافقة الإدارة',
      product 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// تعديل منتج
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      updateData,
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ تغيير حالة المنتج (باع/استعار/تبرع)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      { status },
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    
    res.json({ message: '✅ تم تحديث الحالة', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// حذف منتج
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId
    });
    
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json({ message: '✅ تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// منتجات المستخدم
router.get('/my/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;