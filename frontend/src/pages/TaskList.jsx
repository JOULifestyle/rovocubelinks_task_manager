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
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.slice(0, 5).map(activity => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                          activity.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                          activity.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.user?.email || 'Unknown'}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-900 max-w-md">
                        <span className="truncate block">
                          {activity.details || `${activity.action} ${activity.entityType} #${activity.entityId}`}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs">
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
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
                <Link to="/activity-logs" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all activities →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;