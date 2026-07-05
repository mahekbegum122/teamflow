import React from 'react';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    assignee?: { name: string };
  };
  onStatusChange: (taskId: string, status: string) => void;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onClick }) => {
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

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: '#6c757d',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        marginBottom: '10px',
        borderLeft: `4px solid ${getStatusColor(task.status)}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{task.title}</h4>
        <span style={{
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: getPriorityColor(task.priority),
          color: 'white',
          fontSize: '11px'
        }}>
          {task.priority}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: '#666' }}>
        <span>Assignee: {task.assignee?.name || 'Unassigned'}</span>
        <span style={{
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: getStatusColor(task.status),
          color: 'white',
          fontSize: '11px'
        }}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;