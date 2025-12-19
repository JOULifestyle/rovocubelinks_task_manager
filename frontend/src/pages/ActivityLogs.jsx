import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ActivityLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/activities');
        setLogs(response.data.logs);
      } catch (err) {
        setError('Failed to fetch activity logs');
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchLogs();
    } else {
      setLoading(false);
      setError('Access denied. Admin privileges required.');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="activity-log-section">
        <h1 className="activity-log-header">Activity Logs</h1>
        <p className="activity-description">Monitor all task-related activities in the system</p>

        {logs.length === 0 ? (
          <div className="empty-state">
            <h3>No activity logs</h3>
            <p>No activities have been recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="activity-log-info">
              <div>
                <h3 className="activity-log-title">All Activities</h3>
                <p className="activity-log-count">Showing {logs.length} activities</p>
              </div>
              <div className="activity-log-badges">
                <span className="activity-badge create">CREATE</span>
                <span className="activity-badge update">UPDATE</span>
                <span className="activity-badge delete">DELETE</span>
              </div>
            </div>

            <div className="activity-log-container">
              <div className="activity-table-container">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Task</th>
                      <th>User</th>
                      <th>Activity Details</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className={`activity-badge ${log.action.toLowerCase()}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>{log.taskTitle || `${log.entityType} #${log.entityId}`}</td>
                        <td>{log.user?.email || 'Unknown User'}</td>
                        <td className="activity-details">
                          <span>
                            {log.details || 'No details available'}
                          </span>
                        </td>
                        <td className="activity-time">
                          <div>
                            <span className="date">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                            <span className="time">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;