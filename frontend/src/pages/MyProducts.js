import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardMedia, CardContent,
  Typography, Button, Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyProducts() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/my/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد؟')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
      alert('✅ تم الحذف');
    } catch (error) {
      alert('❌ فشل الحذف');
    }
  };

  // ✅ تغيير حالة المنتج
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ تم تحديث الحالة');
      fetchMyProducts();
    } catch (error) {
      alert('❌ فشل التحديث');
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



  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>📦 منتجاتي</Typography>
      
      <Button 
        variant="contained" 
        sx={{ mb: 3 }}
        onClick={() => navigate('/add-product')}
      >
        ➕ إضافة منتج جديد
      </Button>

      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.images[0] ? `http://localhost:5000${product.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6" noWrap>{product.title}</Typography>
                <Typography color="primary" variant="h6" sx={{ fontWeight: 'bold' }}>
                  {product.price} {product.currency === 'SYP' ? 'ل.س' : product.currency === 'USD' ? '$' : '₺'}
                </Typography>
                
                {/* ✅ عرض الحالة */}
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  الحالة: <strong>{getStatusLabel(product.status)}</strong>
                </Typography>

                {/* ✅ أزرار تغيير الحالة */}
                {product.status === 'approved' && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {product.type === 'sell' && (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(product._id, 'sold')}
                      >
                        ✅ تم البيع
                      </Button>
                    )}
                    {product.type === 'borrow' && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleStatusChange(product._id, 'borrowed')}
                      >
                        ✅ تم الاستعارة
                      </Button>
                    )}
                    {product.type === 'donate' && (
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleStatusChange(product._id, 'donated')}
                      >
                        ✅ تم التبرع
                      </Button>
                    )}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    fullWidth
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(product._id)}
                    fullWidth
                  >
                    حذف
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          لا توجد منتجات بعد. أضف منتجك الأول! 🚀
        </Typography>
      )}
    </Container>
  );
}