import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box,
  MenuItem, Card, CardMedia
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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'books',
    condition: 'used',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = res.data;
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        condition: product.condition,
        images: product.images
      });
      setLoading(false);
    } catch (error) {
      alert('المنتج غير موجود');
      navigate('/');
    }
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    
    newImages.forEach(img => {
      data.append('images', img);
    });

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ تم التحديث بنجاح');
      navigate(`/product/${id}`);
    } catch (error) {
      alert('❌ ' + error.response?.data?.message);
    }
  };

  if (loading) return <Typography>جاري التحميل...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>✏️ تعديل المنتج</Typography>
      
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
        
        <TextField
          label="السعر (ر.س)"
          type="number"
          required
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
        />
        
        <TextField
          select
          label="الفئة"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          {categories.map(cat => (
            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label="الحالة"
          value={formData.condition}
          onChange={(e) => setFormData({...formData, condition: e.target.value})}
        >
          <MenuItem value="new">✨ جديد</MenuItem>
          <MenuItem value="like-new">🔄 شبه جديد</MenuItem>
          <MenuItem value="used">📦 مستعمل</MenuItem>
        </TextField>

        {/* عرض الصور الحالية */}
        {formData.images.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>الصور الحالية:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.images.map((img, idx) => (
                <Card key={idx} sx={{ width: 100 }}>
                  <CardMedia
                    component="img"
                    height="80"
                    image={`http://localhost:5000${img}`}
                    alt={`صورة ${idx + 1}`}
                  />
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Button variant="outlined" component="label">
          📷 إضافة صور جديدة
          <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </Button>
        
        {newImages.length > 0 && (
          <Typography variant="body2" color="primary">
            تم اختيار {newImages.length} صورة جديدة
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
          💾 حفظ التغييرات
        </Button>
      </Box>
    </Container>
  );
}