import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const LayoutWrapper: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div style={styles.main}>
        <Header 
          userName={user.name || 'User'} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main style={styles.content}>
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column'
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f7fa'
  }
};

export default LayoutWrapper;