import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-icon">✓</span>
          <span className="brand-text">Taskify Pro</span>
        </div>

        <div className="navbar-menu">
          {user && (
            <>
              <ThemeToggle />
              <span className="navbar-user">Welcome, {user.username}!</span>
              <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

