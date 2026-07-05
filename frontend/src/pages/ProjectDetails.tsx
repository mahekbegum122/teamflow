import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: { _id: string; name: string } | null;
  dependsOn: { _id: string; title: string; status: string }[];
  dueDate: string;
  estimatedHours: number;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  members: User[];
}

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDependsOn, setNewTaskDependsOn] = useState('');
  
  // Dependency management
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [dependencyTaskId, setDependencyTaskId] = useState('');
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    fetchProjectAndTasks();
    fetchUsers();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch project details
      const projectRes = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projectData = await projectRes.json();
      setProject(projectData.data);
      
      // Fetch tasks
      const tasksRes = await fetch(`http://localhost:5000/api/tasks/project/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tasksData = await tasksRes.json();
      setTasks(tasksData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
// Fixed functions with window. prefix

const createTask = async () => {
  if (!newTaskTitle.trim()) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDesc,
        projectId: projectId,
        assignee: newTaskAssignee || undefined,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined,
        dependsOn: newTaskDependsOn ? [newTaskDependsOn] : []
      })
    });
    
    if (response.ok) {
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskAssignee('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      setNewTaskDependsOn('');
      setShowAddTaskForm(false);
      fetchProjectAndTasks();
    } else {
      const data = await response.json();
      window.alert(data.message || 'Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    window.alert('Error creating task');
  }
};

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      fetchProjectAndTasks();
    } else {
      window.alert(data.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const addDependency = async () => {
  if (!selectedTaskId || !dependencyTaskId) {
    window.alert('Please select both tasks');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/tasks/dependency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        taskId: selectedTaskId,
        dependsOnId: dependencyTaskId
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      window.alert('✅ Dependency added successfully!');
      setShowDependencyModal(false);
      setSelectedTaskId('');
      setDependencyTaskId('');
      fetchProjectAndTasks();
    } else {
      window.alert(data.message || 'Failed to add dependency');
    }
  } catch (error) {
    console.error('Error adding dependency:', error);
  }
};

const deleteTask = async (taskId: string) => {
  if (!window.confirm('Are you sure you want to delete this task?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      fetchProjectAndTasks();
    } else {
      window.alert('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
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

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: '#6c757d',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };
    return colors[priority] || '#6c757d';
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

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      low: '🟢 Low',
      medium: '🟡 Medium',
      high: '🟠 High',
      critical: '🔴 Critical'
    };
    return labels[priority] || priority;
  };

  const getStatusOptions = () => {
    return ['todo', 'in_progress', 'in_review', 'done', 'blocked'];
  };

  const getPriorityOptions = () => {
    return ['low', 'medium', 'high', 'critical'];
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading project...</p>
      </div>
    );
  }

  // Tasks statistics
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back
          </button>
          <div>
            <h1 style={styles.headerTitle}>{project?.name}</h1>
            <p style={styles.headerSubtitle}>{project?.description || 'No description'}</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.projectStatus}>
            {project?.status || 'Active'}
          </span>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{totalTasks}</span>
          <span style={styles.statLabel}>Total Tasks</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{completionRate}%</span>
          <span style={styles.statLabel}>Completion</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{todoTasks}</span>
          <span style={styles.statLabel}>To Do</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{inProgressTasks}</span>
          <span style={styles.statLabel}>In Progress</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{doneTasks}</span>
          <span style={styles.statLabel}>Done</span>
        </div>
        {blockedTasks > 0 && (
          <div style={{ ...styles.statItem, color: '#dc3545' }}>
            <span style={styles.statNumber}>{blockedTasks}</span>
            <span style={styles.statLabel}>Blocked</span>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div style={styles.actionsBar}>
        <div style={styles.actionsLeft}>
          <button 
            onClick={() => setShowAddTaskForm(!showAddTaskForm)}
            style={styles.addTaskBtn}
          >
            {showAddTaskForm ? '✕ Close' : '+ Add Task'}
          </button>
          <button 
            onClick={() => setShowDependencyModal(true)}
            style={styles.dependencyBtn}
          >
            🔗 Add Dependency
          </button>
        </div>
        <div style={styles.actionsRight}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              ...styles.viewBtn,
              backgroundColor: viewMode === 'kanban' ? '#0066cc' : '#e9ecef',
              color: viewMode === 'kanban' ? 'white' : '#333'
            }}
          >
            📊 Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              ...styles.viewBtn,
              backgroundColor: viewMode === 'list' ? '#0066cc' : '#e9ecef',
              color: viewMode === 'list' ? 'white' : '#333'
            }}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddTaskForm && (
        <div style={styles.addTaskForm}>
          <h3 style={styles.formTitle}>Create New Task</h3>
          <div style={styles.formGrid}>
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title *"
              style={styles.formInput}
            />
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Description"
              style={styles.formTextarea}
            />
            <select
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              style={styles.formSelect}
            >
              <option value="">Assign to...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              style={styles.formSelect}
            >
              {getPriorityOptions().map(p => (
                <option key={p} value={p}>{getPriorityLabel(p)}</option>
              ))}
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              style={styles.formInput}
            />
            <select
              value={newTaskDependsOn}
              onChange={(e) => setNewTaskDependsOn(e.target.value)}
              style={styles.formSelect}
            >
              <option value="">No dependency</option>
              {tasks.filter(t => t.status === 'done').map(task => (
                <option key={task._id} value={task._id}>
                  ✅ {task.title}
                </option>
              ))}
              {tasks.filter(t => t.status !== 'done' && t.status !== 'todo').map(task => (
                <option key={task._id} value={task._id}>
                  {task.title} ({task.status})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formActions}>
            <button onClick={() => setShowAddTaskForm(false)} style={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={createTask} style={styles.submitBtn}>
              Create Task
            </button>
          </div>
        </div>
      )}

      {/* Dependency Modal */}
      {showDependencyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>🔗 Add Task Dependency</h3>
            <p style={styles.modalSubtitle}>Task A depends on Task B (Task B must be done first)</p>
            
            <div style={styles.modalForm}>
              <label style={styles.modalLabel}>Task that depends:</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                style={styles.modalSelect}
              >
                <option value="">Select task...</option>
                {tasks.filter(t => t.status !== 'done').map(task => (
                  <option key={task._id} value={task._id}>
                    {task.title} ({task.status})
                  </option>
                ))}
              </select>
              
              <label style={styles.modalLabel}>Depends on (must be done first):</label>
              <select
                value={dependencyTaskId}
                onChange={(e) => setDependencyTaskId(e.target.value)}
                style={styles.modalSelect}
              >
                <option value="">Select task...</option>
                {tasks.filter(t => t._id !== selectedTaskId).map(task => (
                  <option key={task._id} value={task._id}>
                    {task.title} ({task.status})
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.modalActions}>
              <button onClick={() => setShowDependencyModal(false)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={addDependency} style={styles.submitBtn}>
                Add Dependency
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks View */}
      {viewMode === 'kanban' ? (
        <div style={styles.kanbanGrid}>
          {['todo', 'in_progress', 'in_review', 'done'].map(status => (
            <div key={status} style={styles.kanbanColumn}>
              <div style={{
                ...styles.columnHeader,
                borderBottomColor: getStatusColor(status)
              }}>
                <span>{getStatusLabel(status)}</span>
                <span style={styles.columnCount}>
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskHeader}>
                    <strong style={styles.taskTitle}>{task.title}</strong>
                    <span style={{
                      ...styles.priorityBadge,
                      backgroundColor: getPriorityColor(task.priority)
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p style={styles.taskDesc}>{task.description}</p>
                  )}
                  
                  {task.assignee && (
                    <div style={styles.taskAssignee}>
                      👤 {task.assignee.name}
                    </div>
                  )}
                  
                  {task.dueDate && (
                    <div style={styles.taskDueDate}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {task.dependsOn && task.dependsOn.length > 0 && (
                    <div style={styles.taskDeps}>
                      ⚡ Depends on: {task.dependsOn.map(d => 
                        <span key={d._id} style={{
                          ...styles.depTag,
                          backgroundColor: d.status === 'done' ? '#28a745' : '#ffc107'
                        }}>
                          {d.title}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div style={styles.taskActions}>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      {getStatusOptions().map(s => (
                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={styles.deleteBtn}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === status).length === 0 && (
                <p style={styles.emptyColumn}>No tasks</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.listView}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Dependencies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td><strong>{task.title}</strong></td>
                  <td>
                    <span style={{
                      ...styles.tableStatus,
                      backgroundColor: getStatusColor(task.status)
                    }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      ...styles.tablePriority,
                      backgroundColor: getPriorityColor(task.priority)
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.assignee?.name || 'Unassigned'}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td>{task.dependsOn?.length || 0}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      style={styles.smallSelect}
                    >
                      {getStatusOptions().map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column' as 'column'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e9ecef',
    borderTop: '4px solid #0066cc',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  header: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px'
  },
  headerSubtitle: {
    margin: 0,
    opacity: 0.7,
    fontSize: '14px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  projectStatus: {
    padding: '6px 16px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '20px',
    fontSize: '14px'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '15px',
    padding: '20px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e9ecef'
  },
  statItem: {
    textAlign: 'center' as 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666'
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e9ecef',
    flexWrap: 'wrap' as 'wrap',
    gap: '10px'
  },
  actionsLeft: {
    display: 'flex',
    gap: '10px'
  },
  actionsRight: {
    display: 'flex',
    gap: '10px'
  },
  addTaskBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  dependencyBtn: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  viewBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  addTaskForm: {
    backgroundColor: 'white',
    padding: '20px 30px',
    margin: '0 30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  formTitle: {
    margin: '0 0 15px 0',
    color: '#1a1a2e'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  formInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  formTextarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '60px',
    gridColumn: '1 / -1'
  },
  formSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '15px'
  },
  cancelBtn: {
    padding: '8px 20px',
    backgroundColor: '#e9ecef',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '8px 20px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%'
  },
  modalTitle: {
    margin: '0 0 5px 0',
    color: '#1a1a2e'
  },
  modalSubtitle: {
    margin: '0 0 20px 0',
    color: '#666',
    fontSize: '14px'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '15px'
  },
  modalLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555'
  },
  modalSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  kanbanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px 30px'
  },
  kanbanColumn: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    minHeight: '200px'
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '3px solid',
    marginBottom: '15px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  columnCount: {
    backgroundColor: '#e9ecef',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  taskCard: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  taskTitle: {
    fontSize: '14px'
  },
  priorityBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '10px',
    textTransform: 'uppercase' as 'uppercase'
  },
  taskDesc: {
    fontSize: '13px',
    color: '#666',
    margin: '5px 0'
  },
  taskAssignee: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  taskDueDate: {
    fontSize: '12px',
    color: '#666',
    marginTop: '3px'
  },
  taskDeps: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '4px'
  },
  depTag: {
    padding: '1px 6px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '10px'
  },
  taskActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    gap: '5px'
  },
  statusSelect: {
    padding: '4px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '11px',
    flex: 1
  },
  deleteBtn: {
    padding: '2px 8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  emptyColumn: {
    textAlign: 'center' as 'center',
    color: '#999',
    fontSize: '14px',
    padding: '20px 0'
  },
  listView: {
    padding: '20px 30px'
  },
  table: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderCollapse: 'collapse' as 'collapse',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tableStatus: {
    padding: '3px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '11px'
  },
  tablePriority: {
    padding: '3px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '11px'
  },
  smallSelect: {
    padding: '4px 6px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '11px'
  }
};

export default ProjectDetails;