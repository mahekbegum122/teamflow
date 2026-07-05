import React from 'react';
import TaskCard from './TaskCard';

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignee?: { name: string };
}

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: string) => void;
  onTaskClick: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onStatusChange, onTaskClick }) => {
  const columns = ['todo', 'in_progress', 'in_review', 'done', 'blocked'];

  const getColumnTitle = (status: string) => {
    const titles: { [key: string]: string } = {
      todo: '📋 To Do',
      in_progress: '🔄 In Progress',
      in_review: '👀 In Review',
      done: '✅ Done',
      blocked: '🚫 Blocked'
    };
    return titles[status] || status;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
      gap: '20px',
      padding: '20px 0'
    }}>
      {columns.map(status => {
        const columnTasks = tasks.filter(task => task.status === status);
        return (
          <div key={status} style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            minHeight: '200px'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              paddingBottom: '10px',
              borderBottom: '2px solid #dee2e6'
            }}>
              {getColumnTitle(status)}
              <span style={{
                marginLeft: '10px',
                fontSize: '14px',
                color: '#6c757d'
              }}>
                ({columnTasks.length})
              </span>
            </h3>
            {columnTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={onStatusChange}
                onClick={() => onTaskClick(task._id)}
              />
            ))}
            {columnTasks.length === 0 && (
              <p style={{ color: '#adb5bd', textAlign: 'center', padding: '20px 0' }}>
                No tasks
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;