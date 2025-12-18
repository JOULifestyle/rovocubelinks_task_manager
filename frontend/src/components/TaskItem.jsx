import { useState } from 'react';
import TaskForm from './TaskForm';

const TaskItem = ({ task, onUpdate, onDelete, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onUpdate(task.id, { ...task, completed: !task.completed });
    } catch (err) {
      setError('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedTask) => {
    setLoading(true);
    setError(null);
    try {
      await onUpdate(task.id, updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    setError(null);
    try {
      await onDelete(task.id);
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <TaskForm
          onSubmit={handleUpdate}
          initialTask={task}
          onCancel={handleCancel}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        {task.creator && (
          <small>Created by: {task.creator.email}</small>
        )}
        {task.assignee && (
          <small>Assigned to: {task.assignee.email}</small>
        )}
      </div>
      <div className="task-actions">
        {userRole && (
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleComplete}
              disabled={loading}
            />
            Completed
          </label>
        )}
        {userRole && (
          <button onClick={handleEdit} disabled={loading}>
            Edit
          </button>
        )}
        {userRole === 'admin' && (
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TaskItem;