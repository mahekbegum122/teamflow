import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project: { _id: string; name: string };
  dueDate: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks/my-tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      todo: '#6c757d',
      in_progress: '#0066cc',
      in_review: '#ffc107',
      done: '#28a745',
      blocked: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      todo: '📋 To Do',
      in_progress: '🔄 In Progress',
      in_review: '👀 In Review',
      done: '✅ Done',
      blocked: '🚫 Blocked'
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div style={styles.loading}>Loading your tasks...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 My Tasks</h1>
      <p style={styles.subtitle}>Tasks assigned to: {user.name || 'You'}</p>

      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div style={styles.taskGrid}>
          {tasks.map(task => (
            <div key={task._id} style={styles.taskCard}>
              <div style={styles.taskHeader}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(task.status)
                }}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
              
              <p style={styles.taskDesc}>{task.description || 'No description'}</p>
              
              <div style={styles.taskMeta}>
                <span style={styles.projectName}>📁 {task.project?.name}</span>
                {task.dueDate && (
                  <span style={styles.dueDate}>
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: task.priority === 'high' ? '#dc3545' : 
                                  task.priority === 'medium' ? '#ffc107' : '#6c757d'
                }}>
                  {task.priority}
                </span>
              </div>
              
              <button
                onClick={() => navigate(`/project/${task.project?._id}`)}
                style={styles.viewBtn}
              >
                View Project →
              </button>
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '5px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px'
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
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  taskTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#1a1a2e'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px'
  },
  taskDesc: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px'
  },
  taskMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as 'wrap',
    gap: '8px',
    marginBottom: '15px'
  },
  projectName: {
    fontSize: '13px',
    color: '#666'
  },
  dueDate: {
    fontSize: '13px',
    color: '#666'
  },
  priorityBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '11px',
    textTransform: 'uppercase' as 'uppercase'
  },
  viewBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default MyTasks;