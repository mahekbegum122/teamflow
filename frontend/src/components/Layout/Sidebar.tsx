import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📋', label: 'My Tasks', path: '/mytasks' },
    { icon: '🔍', label: 'RCA', path: '/rca' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={styles.overlay} />
      )}

      <div style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div style={styles.header}>
          <h2 style={styles.logo}>📊 TeamFlow</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                ...styles.navItem,
                backgroundColor: location.pathname === item.path ? '#2a2a4e' : 'transparent'
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={styles.bottom}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>👤</div>
            <div>
              <div style={styles.userName}>{user.name || 'Guest'}</div>
              <div style={styles.userEmail}>{user.email || 'guest@teamflow.com'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as 'column'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    margin: 0,
    fontSize: '20px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer'
  },
  nav: {
    flex: 1,
    padding: '20px 0'
  },
  navItem: {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderRadius: '8px',
    margin: '4px 10px'
  },
  navIcon: {
    fontSize: '20px'
  },
  bottom: {
    padding: '20px',
    borderTop: '1px solid #333'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#2a2a4e',
    borderRadius: '8px'
  },
  userAvatar: {
    fontSize: '24px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: '12px',
    opacity: 0.7
  }
};

export default Sidebar;