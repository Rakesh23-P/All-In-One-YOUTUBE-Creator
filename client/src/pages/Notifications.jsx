import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBell, FaCheck, FaTrash, FaCheckSquare } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(`/api/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        toast.success('Notification marked as read');
      }
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/notifications/${id}`);
      if (res.data.success) {
        setNotifications(notifications.filter(n => n._id !== id));
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    
    try {
      setLoading(true);
      for (const item of unread) {
        await axios.put(`/api/notifications/${item._id}/read`);
      }
      toast.success('All notifications marked as read!');
      await fetchNotifications();
    } catch (error) {
      toast.error('Error marking notifications read');
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {/* Title & mark read controls */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              System <span className="gradient-text">Notifications</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Stay updated with upload.
            </p>
          </div>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <button className="btn btn-secondary flex-align" onClick={handleMarkAllRead}>
              <FaCheckSquare /> Mark All Read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif._id} 
                className="glass-card flex-between" 
                style={{
                  padding: '1.25rem',
                  borderLeft: notif.isRead ? '1px solid var(--glass-border)' : '4px solid var(--primary)',
                  background: notif.isRead ? 'rgba(15, 21, 36, 0.4)' : 'rgba(15, 21, 36, 0.7)',
                  gap: '1rem'
                }}
              >
                <div className="flex-align" style={{ gap: '1.25rem', flexGrow: 1 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: notif.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(255, 0, 85, 0.1)',
                    border: notif.isRead ? '1px solid var(--glass-border)' : '1px solid rgba(255, 0, 85, 0.2)',
                    color: notif.isRead ? 'var(--text-secondary)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    <FaBell />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex-align" style={{ gap: '0.5rem' }}>
                  {!notif.isRead && (
                    <button 
                      className="nav-icon-btn" 
                      onClick={() => handleMarkAsRead(notif._id)}
                      title="Mark as Read"
                      style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className="nav-icon-btn" 
                    onClick={() => handleDelete(notif._id)}
                    title="Delete Notification"
                    style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <FaBell style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
              <h3>No Notifications</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>You're all caught up! Upload logs.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
