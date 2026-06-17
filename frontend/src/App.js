import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import { AuthProvider } from './context/AuthContext'; // ✅ عدلت هون

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1a5276' },
    secondary: { main: '#2980b9' },
    background: { default: '#f5f6fa' },
  },
  typography: {
    fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
  }
});

// ✅ تأثيرات أوضح وأقوى
const professionalStyles = `
  /* ✅ ظهور تدريجي واضح */
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* ✅ خط فاصل متحرك واضح */
  @keyframes lineMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* ✅ تأثير نبض خفيف للشعار */
  @keyframes subtlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  
  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animated-line {
    height: 4px;
    background: linear-gradient(90deg, #1a5276, #3498db, #1a5276);
    background-size: 200% 100%;
    animation: lineMove 4s ease infinite;
    border-radius: 2px;
  }
  
  /* ✅ بطاقة مع تأثير واضح */
  .card-effect {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.05);
  }
  
  .card-effect:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(26, 82, 118, 0.2);
    border-color: rgba(26, 82, 118, 0.2);
  }
  
  /* ✅ صورة تكبير واضح */
  .image-zoom {
    transition: transform 0.5s ease;
  }
  
  .image-zoom:hover {
    transform: scale(1.08);
  }
  
  /* ✅ زر مع تأثير واضح */
  .btn-effect {
    transition: all 0.3s ease;
    position: relative;
  }
  
  .btn-effect:hover {
    background-color: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }
  
  /* ✅ شعار مع نبض خفيف */
  .logo-pulse {
    animation: subtlePulse 3s ease-in-out infinite;
  }
  
  /* ✅ عنوان بظل واضح */
  .title-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  /* ✅ خلفية متدرجة متحركة */
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .gradient-bg {
    background: linear-gradient(-45deg, #f5f6fa, #e8f4f8, #f0f7ff, #f5f6fa);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{professionalStyles}</style>
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="gradient-bg" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;