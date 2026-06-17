import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardMedia, Typography,
  Button, Box, Chip, Grid, Divider, Avatar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const categories = {
  books: '📚 كتب',
  notes: '📝 ملازم',
  tools: '🔧 أدوات',
  electronics: '💻 إلكترونيات',
  other: '📦 أخرى'
};

const conditions = {
  new: '✨ جديد',
  'like-new': '🔄 شبه جديد',
  used: '📦 مستعمل'
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      alert('المنتج غير موجود');
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ تم الحذف بنجاح');
      navigate('/my-products');
    } catch (error) {
      alert('❌ ' + error.response?.data?.message);
    }
  };

  const handleWhatsApp = () => {
    const phone = product.sellerPhone?.replace(/[^0-9]/g, '');
    if (phone) {
      window.open(`https://wa.me/${phone}`, '_blank');
    } else {
      alert('رقم الهاتف غير متاح');
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'sold': return '❌ تم البيع';
      case 'borrowed': return '❌ تم الاستعارة';
      case 'donated': return '❌ تم التبرع';
      case 'approved': return '✅ متاح';
      case 'pending': return '⏳ بانتظار الموافقة';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'sold': return 'error';
      case 'borrowed': return 'warning';
      case 'donated': return 'info';
      case 'approved': return 'success';
      case 'pending': return 'default';
      default: return 'default';
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

  if (!product) return <Typography>جاري التحميل...</Typography>;

  const isOwner = user && user.id === product.seller?._id;
  const isAvailable = product.status === 'approved';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* صور المنتج */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.images[0] ? `http://localhost:5000${product.images[0]}` : 'https://via.placeholder.com/400?text=No+Image'}
              alt={product.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          {product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${img}`}
                  alt={`صورة ${idx + 1}`}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* تفاصيل المنتج */}
        <Grid item xs={12} md={6}>
          <Box>
            <Chip 
              label={categories[product.category]} 
              color="primary" 
              sx={{ mb: 2 }} 
            />
            <Chip 
              label={conditions[product.condition]} 
              variant="outlined" 
              sx={{ mb: 2, mr: 1 }} 
            />

            {/* ✅ عرض الحالة */}
            <Chip 
              label={getStatusLabel(product.status)} 
              color={getStatusColor(product.status)} 
              sx={{ mb: 2, mr: 1 }} 
            />

            <Typography variant="h4" gutterBottom fontWeight="bold">
              {product.title}
            </Typography>

            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.type === 'donate' ? 'مجاني 🎁' : 
               product.type === 'borrow' ? 'للإعارة 🔄' : 
               `${product.price} ${getCurrencySymbol(product.currency)}`}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            {product.borrowDuration && (
              <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                ⏱️ مدة الإعارة: {product.borrowDuration}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* معلومات البائع */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {product.seller?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.seller?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.seller?.university}
                </Typography>
              </Box>
            </Box>

            {/* ✅ أزرار التواصل - فقط إذا متاح */}
            {!isOwner && isAvailable && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleWhatsApp}
                sx={{ mb: 2, bgcolor: '#25D366' }}
              >
                💬 تواصل عبر واتساب
              </Button>
            )}

            {!isOwner && !isAvailable && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled
                sx={{ mb: 2, bgcolor: 'grey.500' }}
              >
                ❌ هذا المنتج لم يعد متوفراً
              </Button>
            )}

            {/* أزرار المالك */}
            {isOwner && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate(`/edit-product/${id}`)}
                >
                  ✏️ تعديل
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleDelete}
                >
                  🗑️ حذف
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}