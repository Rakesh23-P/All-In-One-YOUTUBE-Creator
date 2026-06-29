import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { 
  FaYoutube, 
  FaBell, 
  FaSun, 
  FaMoon, 
  FaSignOutAlt, 
  FaUserCircle,
  FaSearch
} from 'react-icons/fa';

import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/notifications');
          if (res.data.success) {
            const unread = res.data.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
          }
        } catch (error) {
          console.warn('Navbar notification pull skipped.');
        }
      }
    };

    fetchNotificationCount();
    // Poll notifications every 30 seconds for live updates
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-left">
        <Link to="/dashboard" className="logo flex-align">
          <FaYoutube className="youtube-logo-icon" />
          <span className="logo-text">YOUTUBE STUDIO</span>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button 
          className="nav-icon-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>

        {/* Notifications Icon with Badge */}
        {user && (
          <Link to="/notifications" className="nav-icon-btn notification-link" title="Notifications">
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
        )}

        {/* User Profile Info & Dropdown */}
        {user ? (
          <div className="user-profile-widget">
            <Link to="/profile" className="profile-link flex-align">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="nav-avatar" />
              ) : (
                <FaUserCircle className="default-avatar-icon" />
              )}
              <span className="nav-username">{user.name}</span>
            </Link>
            <button className="nav-icon-btn logout-btn" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
