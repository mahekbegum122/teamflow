import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Settings</h1>
      
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Preferences</h3>
        
        <div style={styles.settingRow}>
          <label style={styles.label}>Theme</label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            style={styles.select}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>
        
        <div style={styles.settingRow}>
          <label style={styles.label}>Email Notifications</label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            style={styles.checkbox}
          />
        </div>
      </div>
      
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Account</h3>
        <div style={styles.settingRow}>
          <label style={styles.label}>Name</label>
          <input type="text" value="Mahek Begum" style={styles.input} />
        </div>
        <div style={styles.settingRow}>
          <label style={styles.label}>Email</label>
          <input type="email" value="mahek@email.com" style={styles.input} />
        </div>
        <button style={styles.saveBtn}>Save Changes</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    fontSize: '18px',
    color: '#1a1a2e',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee'
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '20px'
  },
  label: {
    minWidth: '150px',
    fontSize: '14px',
    color: '#555'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    flex: 1
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    flex: 1
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '10px 30px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px'
  }
};

export default Settings;