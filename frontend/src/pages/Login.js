import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">🔐 تسجيل الدخول</Typography>
        
        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            دخول
          </Button>
          
          <Typography align="center" sx={{ mt: 2 }}>
            ما عندك حساب؟ <Link to="/register">سجّل هون</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}