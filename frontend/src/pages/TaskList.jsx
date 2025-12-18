import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, createTask, updateTask, deleteTask, fetchActivities } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
    if (user?.role === 'admin') {
      loadActivities();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks();
      // Map backend status to frontend completed
      const mappedTasks = fetchedTasks.map(task => ({
        ...task,
        completed: task.status === 'completed'
      }));
      setTasks(mappedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetchActivities();
      setActivities(response.logs);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      const mappedTask = {
        ...newTask,
        completed: newTask.status === 'completed'
      };
      setTasks([...tasks, mappedTask]);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await updateTask(taskId, {
        ...taskData,
        status: taskData.completed ? 'completed' : 'pending'
      });
      const mappedTask = {
        ...updatedTask,
        completed: updatedTask.status === 'completed'
      };
      setTasks(tasks.map(task => task.id === taskId ? mappedTask : task));
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h1>Task List</h1>
      {error && <div className="error-message">{error}</div>}

      {user?.role === 'admin' && (
        <TaskForm onSubmit={addTask} />
      )}

      <div className="tasks">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            userRole={user?.role}
          />
        ))}
      </div>

      {user?.role === 'admin' && activities.length > 0 && (
        <div className="activity-log-section">
          <h2 className="activity-log-header">Recent Activity</h2>

          <div className="activity-log-info">
            <div>
              <h3 className="activity-log-title">Recent Activities</h3>
              <p className="activity-log-count">Showing {Math.min(activities.length, 5)} activities</p>
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
                    <th>User</th>
                    <th>Details</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 5).map(activity => (
                    <tr key={activity.id}>
                      <td>
                        <span className={`activity-badge ${activity.action.toLowerCase()}`}>
                          {activity.action}
                        </span>
                      </td>
                      <td>{activity.user?.email || 'Unknown'}</td>
                      <td className="activity-details">
                        <span>
                          {activity.details || `${activity.action} ${activity.entityType} #${activity.entityId}`}
                        </span>
                      </td>
                      <td className="activity-time">
                        <div>
                          <span className="date">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                          <span className="time">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activities.length > 5 && (
              <div className="activity-view-all">
                <Link to="/activity-logs">View all activities →</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;