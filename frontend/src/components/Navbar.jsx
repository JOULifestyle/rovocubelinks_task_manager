import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/tasks" className="navbar-title">
          <h2>Task Manager</h2>
        </Link>
      </div>
      <div className="navbar-nav">
        <Link to="/tasks" className="nav-link">Tasks</Link>
        {user && user.role === 'admin' && (
          <Link to="/activity-logs" className="nav-link">Activity Logs</Link>
        )}
      </div>
      <div className="navbar-user">
        {user && <span>Welcome, {user.email} ({user.role})</span>}
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;