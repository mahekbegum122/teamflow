import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      const data = response.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '11px',
            minWidth: '18px',
            textAlign: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: '50px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '350px',
          maxHeight: '400px',
          overflow: 'auto',
          zIndex: 1000
        }}>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0066cc',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div>
            {notifications.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                No notifications
              </p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: notification.read ? 'white' : '#f0f7ff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px' }}>{notification.message}</p>
                  <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#adb5bd' }}>
                    {new Date(notification.createdAt).toLocaleDateString()} 
                    {' '}
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;