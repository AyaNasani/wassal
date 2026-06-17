const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  currency: { type: String, enum: ['SYP', 'USD', 'TRY'], default: 'SYP' },
  category: { type: String, enum: ['books', 'notes', 'tools', 'electronics', 'other'], required: true },
  type: { type: String, enum: ['sell', 'borrow', 'donate'], required: true },
  borrowDuration: { type: String, default: '' },
  condition: { type: String, enum: ['new', 'used', 'like-new'], default: 'used' },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'sold', 'borrowed', 'donated', 'available'],
    default: 'pending'
  },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);