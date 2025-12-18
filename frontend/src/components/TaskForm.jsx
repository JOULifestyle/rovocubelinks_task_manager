import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialTask, onCancel, loading = false, error = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...initialTask,
        title,
        description,
        completed: initialTask ? initialTask.completed : false,
      });
      if (!initialTask) {
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initialTask ? 'Update Task' : 'Add Task')}
        </button>
        {initialTask && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;