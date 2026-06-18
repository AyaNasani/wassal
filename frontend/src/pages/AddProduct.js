import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, TextField, Button, Typography, Box, 
  Paper, MenuItem, FormControl, InputLabel, Select 
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = [
  { value: 'books', label: '📚 كتب' },
  { value: 'notes', label: '📝 ملازم' },
  { value: 'tools', label: '🔧 أدوات' },
  { value: 'electronics', label: '💻 إلكترونيات' },
  { value: 'other', label: '📦 أخرى' }
];

const types = [
  { value: 'sell', label: '💰 للبيع' },
  { value: 'borrow', label: '🔄 للإعارة' },
  { value: 'donate', label: '🎁 مجاني/تبرع' }
];

const currencies = [
  { value: 'SYP', label: '🇱🇾 ليرة سورية' },
  { value: 'USD', label: '🇺🇸 دولار أمريكي' },
  { value: 'TRY', label: '🇹🇷 ليرة تركية' }
];

export default function AddProduct() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'SYP',
    category: 'books',
    type: 'sell',
    borrowDuration: '',
    condition: 'used',
    sellerName: user?.name || '',
    sellerPhone: user?.phone || ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // تحقق من السعر
  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setFormData({...formData, price: ''});
      setPriceError('');
      return;
    }
    
    if (!/^\d*\.?\d*$/.test(value)) {
      setPriceError('❌ الرجاء إدخال أرقام فقط');
      return;
    }
    
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      setPriceError('❌ الرجاء إدخال رقم صحيح');
      return;
    }
    
    if (num === 0 && formData.type === 'sell') {
      setPriceError('❌ السعر يجب أن يكون أكبر من صفر');
      return;
    }
    
    setFormData({...formData, price: value});
    setPriceError('');
  };

  // ✅ تحقق من رقم الهاتف
  const validatePhone = (phone) => {
    // إزالة المسافات والشرطات
  const cleanPhone = phone.replace(new RegExp("[\\s-]", "g"), ''); 
    
    // رقم سوري: يبدأ بـ 09 و 10 أرقام
    const syrianPhone = /^09\d{8}$/;
    
    // رقم تركي محلي: يبدأ بـ 5 و 10 أرقام
    const turkishPhoneLocal = /^5\d{9}$/;
    
    // رقم تركي دولي: يبدأ بـ +90 و 10 أرقام بعد
    const turkishPhoneIntl = /^\+90\d{10}$/;
    
    // رقم دولي عام: يبدأ بـ + و 10-15 رقم
    const internationalPhone = /^\+\d{10,15}$/;
    
    if (syrianPhone.test(cleanPhone)) {
      return { valid: true, message: '✅ رقم سوري صحيح' };
    }
    if (turkishPhoneLocal.test(cleanPhone)) {
      return { valid: true, message: '✅ رقم تركي صحيح' };
    }
    if (turkishPhoneIntl.test(cleanPhone)) {
      return { valid: true, message: '✅ رقم تركي دولي صحيح (+90)' };
    }
    if (internationalPhone.test(cleanPhone)) {
      return { valid: true, message: '✅ رقم دولي صحيح' };
    }
    
    return { 
      valid: false, 
      message: '❌ رقم غير صحيح. الأنماط المقبولة:\n• سوري: 09xxxxxxxx\n• تركي: 5xxxxxxxx أو +90xxxxxxxxxx\n• دولي: +xxxxxxxxxxx' 
    };
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, sellerPhone: value});
    
    if (value === '') {
      setPhoneError('');
      return;
    }
    
    const validation = validatePhone(value);
    if (validation.valid) {
      setPhoneError(validation.message);
    } else {
      setPhoneError(validation.message);
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تحقق من السعر
    if (formData.type === 'sell') {
      if (formData.price === '' || formData.price === '0') {
        setError('❌ الرجاء إدخال السعر');
        return;
      }
      if (priceError && priceError.startsWith('❌')) {
        setError('❌ الرجاء تصحيح السعر');
        return;
      }
    }
    
    // ✅ تحقق من رقم الهاتف
    const phoneValidation = validatePhone(formData.sellerPhone);
    if (!phoneValidation.valid) {
      setError(phoneValidation.message);
      return;
    }
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    images.forEach(img => {
      data.append('images', img);
    });

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ تم إضافة الإعلان بنجاح! وهو بانتظار موافقة الإدارة');
      navigate('/my-products');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ');
    }
  };

  const getCurrencySymbol = (currency) => {
    switch(currency) {
      case 'SYP': return 'ل.س';
      case 'USD': return '$';
      case 'TRY': return '₺';
      default: return 'ل.س';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          ➕ إضافة إعلان جديد
        </Typography>
        
        {error && <Typography color="error" align="center" sx={{ mb: 2, whiteSpace: 'pre-line' }}>{error}</Typography>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="اسم المنتج"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <TextField
            label="الوصف"
            multiline
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          
          <FormControl fullWidth>
            <InputLabel>نوع الإعلان</InputLabel>
            <Select
              value={formData.type}
              label="نوع الإعلان"
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {types.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.type === 'sell' && (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="السعر"
                  type="text"
                  required
                  value={formData.price}
                  onChange={handlePriceChange}
                  error={!!priceError && priceError.startsWith('❌')}
                  helperText={priceError}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>العملة</InputLabel>
                  <Select
                    value={formData.currency}
                    label="العملة"
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    {currencies.map(curr => (
                      <MenuItem key={curr.value} value={curr.value}>{curr.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {formData.price && !priceError.startsWith('❌') && (
                <Typography color="success.main" variant="body2">
                  ✅ السعر: {formData.price} {getCurrencySymbol(formData.currency)}
                </Typography>
              )}
            </>
          )}

          {formData.type === 'borrow' && (
            <TextField
              label="مدة الإعارة"
              placeholder="مثال: أسبوع، شهر"
              value={formData.borrowDuration}
              onChange={(e) => setFormData({...formData, borrowDuration: e.target.value})}
            />
          )}

          <FormControl fullWidth>
            <InputLabel>الفئة</InputLabel>
            <Select
              value={formData.category}
              label="الفئة"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(cat => (
                <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={formData.condition}
              label="الحالة"
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <MenuItem value="new">✨ جديد</MenuItem>
              <MenuItem value="like-new">🔄 شبه جديد</MenuItem>
              <MenuItem value="used">📦 مستعمل</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="اسم صاحب الإعلان"
            required
            value={formData.sellerName}
            onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
          />

          {/* ✅ حقل رقم الهاتف مع التحقق */}
          <TextField
            label="رقم الهاتف"
            required
            placeholder="مثال: 0934694386 أو 5312345678 أو +963934694386 أو +905312345678"
            value={formData.sellerPhone}
            onChange={handlePhoneChange}
            error={!!phoneError && phoneError.startsWith('❌')}
            helperText={phoneError || "سوري: 09xxxxxxxx | تركي: 5xxxxxxxx أو +90xxxxxxxxxx | دولي: +xxxxxxxxxxx"}
            dir="ltr"
          />

          <Button variant="outlined" component="label" sx={{ py: 2 }}>
            📷 اختيار صور
            <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
          </Button>
          
          {images.length > 0 && (
            <Typography variant="body2" color="primary" align="center">
              تم اختيار {images.length} صورة
            </Typography>
          )}

          <Button type="submit" variant="contained" size="large" sx={{ mt: 2, bgcolor: '#1a5276' }}>
            نشر الإعلان
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}