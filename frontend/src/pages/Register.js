import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    major: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">📝 إنشاء حساب</Typography>
        
        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="الاسم الكامل"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          
          <TextField
            label="البريد الإلكتروني"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <TextField
            label="كلمة المرور"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <TextField
            label="الجامعة"
            required
            value={formData.university}
            onChange={(e) => setFormData({...formData, university: e.target.value})}
          />
          
          <TextField
            label="التخصص"
            value={formData.major}
            onChange={(e) => setFormData({...formData, major: e.target.value})}
          />
          
          <TextField
            label="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            إنشاء حساب
          </Button>
          
          <Typography align="center" sx={{ mt: 2 }}>
            عندك حساب؟ <Link to="/login">سجّل دخول</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}