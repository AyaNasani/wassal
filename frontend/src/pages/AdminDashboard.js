import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Tabs, Tab
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

 useEffect(() => {
  if (!user || user.role !== 'admin') {
    navigate('/');
    return;
  }
  fetchStats();
  fetchPending();
  fetchUsers();
  fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ تمت الموافقة');
      fetchPending();
      fetchStats();
    } catch (error) {
      alert('❌ فشل');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('❌ تم الرفض');
      fetchPending();
      fetchStats();
    } catch (error) {
      alert('❌ فشل');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        ⚙️ لوحة تحكم المدير
      </Typography>

      {/* الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#1a5276', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{stats.users || 0}</Typography>
              <Typography>المستخدمين</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2980b9', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{stats.products || 0}</Typography>
              <Typography>المنتجات</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e74c3c', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{stats.pendingProducts || 0}</Typography>
              <Typography>بانتظار المراجعة</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#27ae60', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{stats.reports || 0}</Typography>
              <Typography>البلاغات</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="📋 إعلانات معلقة" />
          <Tab label="👥 المستخدمين" />
          <Tab label="🚨 البلاغات" />
        </Tabs>

        {/* إعلانات معلقة */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>المنتج</TableCell>
                  <TableCell>النوع</TableCell>
                  <TableCell>صاحب الإعلان</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingProducts.map(product => (
                  <TableRow key={product._id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.type === 'sell' ? 'للبيع' : product.type === 'borrow' ? 'للإعارة' : 'مجاني'}
                        color={product.type === 'sell' ? 'primary' : product.type === 'borrow' ? 'secondary' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{product.seller?.name}</TableCell>
                    <TableCell>
                      <Button size="small" color="success" onClick={() => handleApprove(product._id)} sx={{ mr: 1 }}>
                        ✅ قبول
                      </Button>
                      <Button size="small" color="error" onClick={() => handleReject(product._id)}>
                        ❌ رفض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* المستخدمين */}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>البريد</TableCell>
                  <TableCell>الجامعة</TableCell>
                  <TableCell>الدور</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.university}</TableCell>
                    <TableCell>
                      <Chip label={user.role === 'admin' ? 'مدير' : 'مستخدم'} color={user.role === 'admin' ? 'error' : 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* البلاغات */}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>النوع</TableCell>
                  <TableCell>السبب</TableCell>
                  <TableCell>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map(report => (
                  <TableRow key={report._id}>
                    <TableCell>{report.targetType === 'product' ? 'إعلان' : 'مستخدم'}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Chip label={report.status === 'pending' ? 'معلق' : 'محلول'} color={report.status === 'pending' ? 'warning' : 'success'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Container>
  );
}