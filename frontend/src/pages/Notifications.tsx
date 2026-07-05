import React, { useState, useEffect } from 'react';

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      task_assigned: '📋',
      task_status_changed: '🔄',
      rca_submitted: '🔍',
      review_requested: '📝',
      dependency_conflict: '⚠️'
    };
    return icons[type] || '🔔';
  };

  if (loading) {
    return <div style={styles.loading}>Loading notifications...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔔 Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={styles.markAllBtn}>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              style={{
                ...styles.notificationItem,
                backgroundColor: notification.read ? 'white' : '#f0f7ff'
              }}
            >
              <div style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>
              <div style={styles.notificationContent}>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <p style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {!notification.read && (
                <div style={styles.unreadDot}></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: 0
  },
  markAllBtn: {
    padding: '8px 16px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '18px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center' as 'center',
    padding: '40px',
    color: '#999'
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px'
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  notificationIcon: {
    fontSize: '24px',
    marginRight: '15px'
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#1a1a2e'
  },
  notificationTime: {
    margin: '5px 0 0',
    fontSize: '12px',
    color: '#999'
  },
  unreadDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#0066cc',
    borderRadius: '50%',
    marginLeft: '10px'
  }
};

export default Notifications;