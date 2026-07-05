import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
      });
      if (response.ok) {
        setNewProjectName('');
        setNewProjectDesc('');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      planning: '#6c757d',
      active: '#28a745',
      on_hold: '#ffc107',
      completed: '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div style={styles.loading}>Loading projects...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>📊 Dashboard</h1>
        <p style={styles.welcomeSubtitle}>Manage your projects and track progress</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{projects.length}</div>
          <div style={styles.statLabel}>Total Projects</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {projects.filter(p => p.status === 'active').length}
          </div>
          <div style={styles.statLabel}>Active Projects</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>0</div>
          <div style={styles.statLabel}>Tasks Done</div>
        </div>
      </div>

      <div style={styles.createSection}>
        <h2 style={styles.sectionTitle}>Create New Project</h2>
        <div style={styles.createForm}>
          <input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            style={styles.input}
          />
          <input
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            placeholder="Description (optional)"
            style={styles.input}
          />
          <button onClick={createProject} style={styles.createBtn}>
            + Create Project
          </button>
        </div>
      </div>

      <div style={styles.projectGrid}>
        {projects.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No projects yet. Create your first project above!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} style={styles.projectCard}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectName}>{project.name}</h3>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(project.status)
                }}>
                  {project.status}
                </span>
              </div>
              <p style={styles.projectDesc}>
                {project.description || 'No description'}
              </p>
              <button
                onClick={() => navigate(`/project/${project._id}`)}
                style={styles.viewBtn}
              >
                View Tasks →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  welcomeSection: {
    marginBottom: '30px'
  },
  welcomeTitle: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: 0
  },
  welcomeSubtitle: {
    color: '#666',
    margin: '5px 0 0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a2e'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px'
  },
  createSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#1a1a2e'
  },
  createForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as 'wrap'
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  createBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  projectName: {
    margin: 0,
    fontSize: '18px',
    color: '#1a1a2e'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    textTransform: 'capitalize' as 'capitalize'
  },
  projectDesc: {
    color: '#666',
    marginBottom: '15px',
    fontSize: '14px'
  },
  viewBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
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
    gridColumn: '1 / -1',
    textAlign: 'center' as 'center',
    padding: '40px',
    color: '#999'
  }
};

export default Dashboard;