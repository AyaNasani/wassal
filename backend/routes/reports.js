const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// إنشاء بلاغ
router.post('/', auth, async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      reporter: req.userId
    });
    await report.save();
    res.status(201).json({ message: '✅ تم إرسال البلاغ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;