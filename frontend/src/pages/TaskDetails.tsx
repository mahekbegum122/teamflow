import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      // Simulate fetching task
      setTask({
        _id: taskId,
        title: 'Sample Task',
        description: 'This is a sample task description',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-07-15'
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading task...</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>
      
      <div style={styles.card}>
        <h1 style={styles.title}>{task?.title}</h1>
        <p style={styles.description}>{task?.description}</p>
        
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.label}>Status:</span>
            <span style={styles.value}>{task?.status}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Priority:</span>
            <span style={styles.value}>{task?.priority}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Due Date:</span>
            <span style={styles.value}>{task?.dueDate}</span>
          </div>
        </div>
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
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '15px'
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  details: {
    borderTop: '1px solid #eee',
    paddingTop: '20px'
  },
  detailRow: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  label: {
    minWidth: '120px',
    fontWeight: 'bold',
    color: '#555'
  },
  value: {
    color: '#333'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '18px',
    color: '#666'
  }
};

export default TaskDetails;