import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">𝕏</span>
          <span className="brand-name">TwitterClone</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Profile
              </NavLink>
              <div className="nav-user-badge">
                <span className="badge-handle">@{user.username}</span>
                <button type="button" onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
