import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, List, ListItem, ListItemText,
  ListItemButton, Divider, Badge
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
  if (!user) return;
  fetchNotifications();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        🔔 الإشعارات
        {unreadCount > 0 && (
          <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }} />
        )}
      </Typography>

      <Paper>
        <List>
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="لا توجد إشعارات" />
            </ListItem>
          )}

          {notifications.map((notification, index) => (
            <React.Fragment key={notification._id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => markAsRead(notification._id)} sx={{ bgcolor: notification.read ? 'inherit' : '#e3f2fd' }}>
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.message}
                  />
                  {!notification.read && (
                    <Badge color="primary" variant="dot" />
                  )}
                </ListItemButton>
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}