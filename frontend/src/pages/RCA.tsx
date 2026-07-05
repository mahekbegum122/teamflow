import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RCA {
  _id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  reviews: { reviewer: string; decision: string; comment: string }[];
  createdAt: string;
}

const RCA: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [rcas, setRcas] = useState<RCA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRCA, setNewRCA] = useState({
    title: '',
    description: '',
    severity: 'medium'
  });

  useEffect(() => {
    if (!projectId) {
      setError('No project selected. Please go to a project first.');
      setLoading(false);
      return;
    }
    fetchRCAs();
  }, [projectId]);

  const fetchRCAs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/rca/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRcas(data.data || []);
      } else {
        setError('Failed to fetch RCAs');
      }
    } catch (error) {
      console.error('Error fetching RCAs:', error);
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const createRCA = async () => {
    if (!newRCA.title.trim()) {
      window.alert('Please enter a title');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newRCA,
          projectId
        })
      });

      if (response.ok) {
        setNewRCA({ title: '', description: '', severity: 'medium' });
        fetchRCAs();
        window.alert('✅ RCA reported successfully!');
      } else {
        const data = await response.json();
        window.alert(data.message || 'Failed to create RCA');
      }
    } catch (error) {
      console.error('Error creating RCA:', error);
      window.alert('Error creating RCA');
    }
  };

  const addReview = async (rcaId: string, decision: string) => {
    const comment = window.prompt('Enter your review comment:');
    if (comment === null) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rca/${rcaId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision, comment })
      });

      if (response.ok) {
        fetchRCAs();
        window.alert('✅ Review added successfully!');
      } else {
        const data = await response.json();
        window.alert(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      window.alert('Error adding review');
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#6c757d'
    };
    return colors[severity] || '#6c757d';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      reported: '#6c757d',
      investigating: '#0066cc',
      in_review: '#ffc107',
      approved: '#28a745',
      rejected: '#dc3545',
      closed: '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      reported: '📋 Reported',
      investigating: '🔍 Investigating',
      in_review: '👀 In Review',
      approved: '✅ Approved',
      rejected: '❌ Rejected',
      closed: '🔒 Closed'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading RCAs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.errorBtn}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>🔍 Root Cause Analysis</h1>
      </div>

      {/* Create RCA Form */}
      <div style={styles.createSection}>
        <h3 style={styles.sectionTitle}>📝 Report New Incident</h3>
        <div style={styles.form}>
          <input
            placeholder="Incident Title *"
            value={newRCA.title}
            onChange={(e) => setNewRCA({ ...newRCA, title: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Describe the incident in detail..."
            value={newRCA.description}
            onChange={(e) => setNewRCA({ ...newRCA, description: e.target.value })}
            style={styles.textarea}
          />
          <select
            value={newRCA.severity}
            onChange={(e) => setNewRCA({ ...newRCA, severity: e.target.value })}
            style={styles.select}
          >
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button onClick={createRCA} style={styles.createBtn}>
            🚨 Report Incident
          </button>
        </div>
      </div>

      {/* RCA List */}
      <div style={styles.listHeader}>
        <h3 style={styles.listTitle}>All Incidents</h3>
        <span style={styles.listCount}>{rcas.length} incidents</span>
      </div>

      {rcas.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No incidents reported yet. Create your first RCA above!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {rcas.map((rca) => (
            <div key={rca._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{rca.title}</h3>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(rca.severity)
                }}>
                  {rca.severity}
                </span>
              </div>

              <p style={styles.cardDesc}>{rca.description}</p>

              <div style={styles.cardFooter}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(rca.status || 'reported')
                }}>
                  {getStatusLabel(rca.status || 'reported')}
                </span>
                <span style={styles.reviewCount}>
                  📝 Reviews: {rca.reviews?.length || 0}
                </span>
                <span style={styles.date}>
                  📅 {new Date(rca.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.reviewActions}>
                <button
                  onClick={() => addReview(rca._id, 'approved')}
                  style={styles.approveBtn}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => addReview(rca._id, 'rejected')}
                  style={styles.rejectBtn}
                >
                  ❌ Reject
                </button>
              </div>

              {rca.reviews && rca.reviews.length > 0 && (
                <div style={styles.reviewsList}>
                  <h4 style={styles.reviewsTitle}>Reviews:</h4>
                  {rca.reviews.map((review, index) => (
                    <div key={index} style={styles.reviewItem}>
                      <span style={{
                        ...styles.reviewDecision,
                        color: review.decision === 'approved' ? '#28a745' : '#dc3545'
                      }}>
                        {review.decision === 'approved' ? '✅' : '❌'} {review.decision}
                      </span>
                      <span style={styles.reviewComment}>"{review.comment}"</span>
                    </div>
                  ))}
                </div>
              )}
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
    margin: '0 auto',
    minHeight: 'calc(100vh - 200px)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#e9ecef'
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: 0
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '18px',
    color: '#666'
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
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: '#dc3545'
  },
  errorBtn: {
    marginTop: '20px',
    padding: '10px 30px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  createSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    color: '#1a1a2e',
    fontSize: '18px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  createBtn: {
    padding: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  listTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#1a1a2e'
  },
  listCount: {
    fontSize: '14px',
    color: '#666'
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px'
  },
  emptyState: {
    textAlign: 'center' as 'center',
    padding: '40px',
    color: '#999',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#1a1a2e'
  },
  severityBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '11px',
    textTransform: 'uppercase' as 'uppercase'
  },
  cardDesc: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as 'wrap',
    gap: '8px',
    marginBottom: '15px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    textTransform: 'capitalize' as 'capitalize'
  },
  reviewCount: {
    fontSize: '13px',
    color: '#666'
  },
  date: {
    fontSize: '12px',
    color: '#999'
  },
  reviewActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '10px'
  },
  approveBtn: {
    padding: '6px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  rejectBtn: {
    padding: '6px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  reviewsList: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee'
  },
  reviewsTitle: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    color: '#555'
  },
  reviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '5px 0',
    fontSize: '13px'
  },
  reviewDecision: {
    fontWeight: 'bold'
  },
  reviewComment: {
    color: '#666'
  }
};

export default RCA;