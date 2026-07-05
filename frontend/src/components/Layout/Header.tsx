import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell';

interface HeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName = 'User', onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <button onClick={onMenuClick} style={styles.menuBtn}>
          ☰
        </button>
        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
          <span style={styles.logoIcon}>📊</span>
          <span style={styles.logoText}>TeamFlow</span>
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>👋 {userName}</span>
        </div>
        <NotificationBell />
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px 10px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '10px'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  userName: {
    fontSize: '14px',
    opacity: 0.9
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.3s'
  }
};

export default Header;