import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h4 style={styles.title}>TeamFlow</h4>
          <p style={styles.text}>Project Management Platform</p>
        </div>
        
        <div style={styles.section}>
          <h5 style={styles.subtitle}>Features</h5>
          <ul style={styles.list}>
            <li>Task Management</li>
            <li>Dependency Tracking</li>
            <li>Kanban Board</li>
            <li>Notifications</li>
          </ul>
        </div>
        
        <div style={styles.section}>
          <h5 style={styles.subtitle}>Links</h5>
          <ul style={styles.list}>
            <li>Dashboard</li>
            <li>Projects</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>
        
        <div style={styles.section}>
          <h5 style={styles.subtitle}>Contact</h5>
          <ul style={styles.list}>
            <li>📧 support@teamflow.com</li>
            <li>📱 +1 (555) 123-4567</li>
            <li>📍 123 Tech Park, CA</li>
          </ul>
        </div>
      </div>
      
      <div style={styles.bottom}>
        <p>© 2026 TeamFlow. All rights reserved.</p>
        <p>Built with ❤️ for 8th Element</p>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    marginTop: 'auto'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 30px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as 'column'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    color: '#fff'
  },
  subtitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#fff',
    opacity: 0.9
  },
  text: {
    margin: 0,
    color: '#888',
    fontSize: '14px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  bottom: {
    borderTop: '1px solid #333',
    padding: '15px 30px',
    textAlign: 'center' as 'center',
    color: '#666',
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as 'wrap'
  }
};

export default Footer;