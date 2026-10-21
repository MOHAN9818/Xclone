import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          end
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Home</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">Profile</span>
        </NavLink>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-avatar">{initial}</div>
        <div className="sidebar-user-details">
          <strong className="sidebar-name">{user.username}</strong>
          <span className="sidebar-handle">@{user.username}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-logout-btn"
          title="Log out"
        >
          🚪
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
