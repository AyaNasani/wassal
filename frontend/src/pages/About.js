import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import backgroundImage from '../assets/خلفية2.jpeg'; // ✅ المسار الجديد

export default function About() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="md" sx={{ py: 8, position: 'relative', zIndex: 2 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255,0 )'
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            color="primary" 
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            🎓 وصّال
          </Typography>
          
          <Typography 
            variant="h5" 
            gutterBottom 
            align="center" 
            color="secondary"
            sx={{ mb: 4 }}
          >
حلقة وصل بين الطلاب       
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a5276' }}>
              من نحن؟
            </Typography>
            <Typography paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#333' }}>
              وصّال هي منصة طلابية إلكترونية متخصصة لطلاب جامعة الشمال الخاصة، 
              تهدف إلى تسهيل تبادل وبيع وإعارة والتبرع بالمستلزمات الجامعية بين الطلاب.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a5276', mt: 3 }}>
              أهدافنا
            </Typography>
            <Typography component="div" sx={{ lineHeight: 2, color: '#333' }}>
              • توفير منصة آمنة وموثوقة للطلاب<br/>
              • تقليل التكاليف الدراسية على الطلاب<br/>
              • تعزيز ثقافة التعاون والمشاركة<br/>
              • حماية البيئة من خلال إعادة الاستخدام
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a5276', mt: 3 }}>
              مميزات المنصة
            </Typography>
            <Typography component="div" sx={{ lineHeight: 2, color: '#333' }}>
              • سهولة الاستخدام<br/>
              • مراجعة الإعلانات من قبل الإدارة<br/>
              • نظام إشعارات متكامل<br/>
              • حماية البيانات والخصوصية
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a5276', mt: 3 }}>
              معلومات التواصل
            </Typography>
            <Typography sx={{ lineHeight: 2, color: '#333' }}>
              📧 البريد: support@wasal.spu.edu<br/>
              📱 الهاتف: +963 934 694 386<br/>
              🏛️ الجامعة: جامعة الشمال الخاصة - سوريا
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
