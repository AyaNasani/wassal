import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          📞 تواصل معنا
        </Typography>
        
        <Typography align="center" sx={{ mb: 3 }}>
          نحن هنا لمساعدتك! أرسل لنا رسالتك وسنرد عليك في أقرب وقت.
        </Typography>

        {sent && <Alert severity="success" sx={{ mb: 2 }}>✅ تم إرسال رسالتك بنجاح!</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="الاسم"
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
            label="الرسالة"
            multiline
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#1a5276' }}>
            إرسال الرسالة
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>أو تواصل معنا مباشرة:</Typography>
          <Typography>📧 nasaniengineeraya@gmail.com</Typography>
          <Typography>📱 +963 934 694 386</Typography>
          <Typography>📱 +352 681 582 535</Typography>
        </Box>
      </Paper>
    </Container>
  );
}