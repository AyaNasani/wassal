import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardMedia, CardContent,
  Typography, TextField, Box, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'books', label: '📚 كتب' },
  { value: 'notes', label: '📝 ملازم' },
  { value: 'tools', label: '🔧 أدوات' },
  { value: 'electronics', label: '💻 إلكترونيات' },
  { value: 'other', label: '📦 أخرى' }
];

const types = [
  { value: '', label: 'الكل' },
  { value: 'sell', label: '💰 للبيع' },
  { value: 'borrow', label: '🔄 للإعارة' },
  { value: 'donate', label: '🎁 مجاني' }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, type]);

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (type) params.append('type', type);
    
    // ✅ فقط المنتجات المعتمدة والمتاحة
    params.append('status', 'approved');
    
    const res = await axios.get(`http://localhost:5000/api/products?${params}`);
    setProducts(res.data);
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'sell': return '💰 للبيع';
      case 'borrow': return '🔄 للإعارة';
      case 'donate': return '🎁 مجاني';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'sell': return 'primary';
      case 'borrow': return 'secondary';
      case 'donate': return 'success';
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 25%, #d4e6f1 50%, #e8f4f8 75%, #f0f7ff 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientMove 15s ease infinite',
        '@keyframes gradientMove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <Container sx={{ py: 4 }}>
        {/* العنوان الرئيسي */}
        <Box sx={{ textAlign: 'center', mb: 5 }} className="fade-in-up">
          <Typography 
            variant="h2" 
            color="primary" 
            className="title-shadow"
            sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              fontFamily: '"Cairo", sans-serif',
              fontSize: '3rem'
            }}
          >
            وصّال
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem' }}>
            منصة طلاب جامعة الشمال الخاصة
          </Typography>
          <Box className="animated-line" sx={{ width: '150px', mx: 'auto', mb: 2 }} />
        </Box>

        {/* البحث والتصفية */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4, 
          flexWrap: 'wrap',
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <TextField
            label="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            size="small"
          />
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>النوع</InputLabel>
            <Select value={type} label="النوع" onChange={(e) => setType(e.target.value)}>
              {types.map(t => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {categories.map(cat => (
              <Chip
                key={cat.value}
                label={cat.label}
                onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                color={category === cat.value ? 'primary' : 'default'}
                clickable
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* شبكة المنتجات */}
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card 
                className="card-effect fade-in-up"
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  animationDelay: `${index * 0.15}s`
                }} 
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0] ? `http://localhost:5000${product.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.title}
                    className="image-zoom"
                    sx={{ 
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Chip 
                      label={getTypeLabel(product.type)} 
                      color={getTypeColor(product.type)} 
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip 
                      label={categories.find(c => c.value === product.category)?.label} 
                      variant="outlined" 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="h6" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>{product.title}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                    {product.condition === 'new' ? 'جديد' : product.condition === 'like-new' ? 'شبه جديد' : 'مستعمل'}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {product.type === 'donate' ? 'مجاني' : 
                     product.type === 'borrow' ? 'للإعارة' : 
                     `${product.price} ${getCurrencySymbol(product.currency)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {product.seller?.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {products.length === 0 && (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
            لا توجد منتجات متاحة حالياً
          </Typography>
        )}
      </Container>
    </Box>
  );
}