import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a5276' }}>
      <Toolbar>
        {/* الشعار + الاسم */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            textDecoration: 'none',
            color: 'white'
          }}
        >
          <img 
            src={logo} 
            alt="وصّال" 
            className="logo-pulse"
            style={{ 
              height: 45, 
              width: 45, 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }} 
          />
          <Box>
            <Typography 
              variant="h5" 
              className="title-shadow"
              sx={{ 
                fontWeight: 'bold',
                fontFamily: '"Cairo", sans-serif',
                lineHeight: 1.2
              }}
            >
              وصّال
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                fontSize: '0.75rem'
              }}
            >
              جامعة الشمال الخاصة
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button color="inherit" component={Link} to="/" className="btn-effect">
            الرئيسية
          </Button>
          <Button color="inherit" component={Link} to="/about" className="btn-effect">
            من نحن
          </Button>
          <Button color="inherit" component={Link} to="/contact" className="btn-effect">
            تواصل معنا
          </Button>
          
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/notifications" className="btn-effect">
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </Button>
              <Button color="inherit" component={Link} to="/my-products" className="btn-effect">
                منتجاتي
              </Button>
              <Button color="inherit" component={Link} to="/add-product" className="btn-effect">
                إضافة
              </Button>
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin" className="btn-effect">
                  لوحة التحكم
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout} className="btn-effect">
                خروج
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" className="btn-effect">
                تسجيل دخول
              </Button>
              <Button color="inherit" component={Link} to="/register" className="btn-effect">
                حساب جديد
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}