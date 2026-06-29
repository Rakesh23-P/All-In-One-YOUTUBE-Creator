import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaThLarge, 
  FaVideo, 
  FaUpload, 
  FaFolder, 
  FaComments, 
  FaChartBar, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaTasks, 
  FaUserCog, 
  FaLock,
  FaTv
} from 'react-icons/fa';

import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const creatorMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
    { path: '/channel', label: 'My Channel', icon: <FaTv /> },
    { path: '/videos', label: 'Videos', icon: <FaVideo /> },
    { path: '/videos/upload', label: 'Upload Video', icon: <FaUpload /> },
    { path: '/playlists', label: 'Playlists', icon: <FaFolder /> },
    { path: '/comments', label: 'Comments', icon: <FaComments /> },
    { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { path: '/revenue', label: 'Revenue', icon: <FaDollarSign /> },
    { path: '/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks /> },
    { path: '/settings', label: 'Settings', icon: <FaUserCog /> },
  ];

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-menu-list">
        {creatorMenuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link flex-align ${isActive ? 'active' : ''}`}
            end={item.path === '/videos/upload'}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Conditional Admin Sidebar Link */}
        {user && user.role === 'admin' && (
          <div className="admin-sidebar-section">
            <div className="admin-divider-label">ADMIN</div>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `sidebar-link flex-align admin-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><FaLock /></span>
              <span className="sidebar-label">Admin Console</span>
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
