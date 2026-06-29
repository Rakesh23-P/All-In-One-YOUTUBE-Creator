import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Card from '../components/Card';
import Table from '../components/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaShieldAlt, 
  FaUsers, 
  FaVideo, 
  FaComments, 
  FaEye, 
  FaTrash,
  FaUserSlash,
  FaFileVideo
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalCreators: 0, totalVideos: 0, totalComments: 0, platformViews: 0 });
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'videos'

  const fetchAdminData = async () => {
    try {
      // 1. Fetch Admin platform stats
      const statsRes = await axios.get('/api/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch all platform creators
      const usersRes = await axios.get('/api/admin/users');
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

      // 3. Fetch all platform videos
      const videosRes = await axios.get('/api/admin/videos');
      if (videosRes.data.success) {
        setVideos(videosRes.data.data);
      }
    } catch (error) {
      console.error('Error gathering admin control console data', error);
      toast.error('Failed to load administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirm = window.confirm('WARNING: Are you sure you want to permanently delete this creator account? This clears their profile, upload clips, calendar tasks, and comment logs platform-wide.');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/admin/users/${id}`);
        if (res.data.success) {
          toast.success('Creator account and content deleted.');
          fetchAdminData();
        }
      } catch (error) {
        toast.error('Failed to remove creator account');
      }
    }
  };

  const handleDeleteVideo = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this video for copyright/policy violations?');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/admin/videos/${id}`);
        if (res.data.success) {
          toast.success('Video removed from platform.');
          fetchAdminData();
        }
      } catch (error) {
        toast.error('Failed to remove video');
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: '3rem' }}>
        {/* Title ribbon */}
        <div className="flex-align mb-3" style={{ gap: '0.75rem' }}>
          <FaShieldAlt style={{ color: 'var(--secondary)', fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))' }} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Admin <span className="cyan-gradient-text">Console</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              System-wide metrics audit, database creator profiles index, and video content moderator controls.
            </p>
          </div>
        </div>

        {/* Platform Stat Cards Grid */}
        <div className="grid-4 mb-3">
          <Card 
            title="Registered Creators" 
            value={stats.totalCreators} 
            icon={<FaUsers />} 
            description="Active channels" 
          />
          <Card 
            title="Platform Videos" 
            value={stats.totalVideos} 
            icon={<FaVideo />} 
            description="Uploaded clips" 
          />
          <Card 
            title="Viewer Comments" 
            value={stats.totalComments} 
            icon={<FaComments />} 
            description="Moderated items" 
          />
          <Card 
            title="Platform Views" 
            value={stats.platformViews.toLocaleString()} 
            icon={<FaEye />} 
            description="Total viewer hits" 
          />
        </div>

        {/* Tab triggers */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid var(--glass-border)',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem'
        }}>
          <button 
            className="btn" 
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'users' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: activeTab === 'users' ? 'var(--secondary)' : 'var(--text-secondary)',
              border: activeTab === 'users' ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <span className="flex-align"><FaUsers /> Manage Creators ({users.length})</span>
          </button>
          <button 
            className="btn" 
            onClick={() => setActiveTab('videos')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'videos' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: activeTab === 'videos' ? 'var(--secondary)' : 'var(--text-secondary)',
              border: activeTab === 'videos' ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            <span className="flex-align"><FaVideo /> Moderate Content ({videos.length})</span>
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="glass-card">
            <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>Platform Creator Registry</h3>
            {users.length > 0 ? (
              <Table headers={['Avatar', 'Creator Name', 'Email Address', 'Channel Brand', 'Signup Date', 'Actions']}>
                {users.map((creator) => (
                  <tr key={creator._id}>
                    <td>
                      {creator.avatar ? (
                        <img src={creator.avatar} alt={creator.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--secondary)' }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{creator.name.charAt(0)}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{creator.name}</span>
                    </td>
                    <td>{creator.email}</td>
                    <td>
                      <span className="badge badge-published" style={{ color: 'var(--secondary)', borderColor: 'rgba(0, 242, 254, 0.2)', backgroundColor: 'rgba(0, 242, 254, 0.05)' }}>
                        {creator.channelName || 'Unconfigured'}
                      </span>
                    </td>
                    <td>{new Date(creator.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="nav-icon-btn" 
                        onClick={() => handleDeleteUser(creator._id)} 
                        title="Ban / Remove Creator"
                        style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        <FaUserSlash />
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No creators registered on the platform.</div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO MANAGEMENT */}
        {activeTab === 'videos' && (
          <div className="glass-card">
            <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>Global Content Creation</h3>
            {videos.length > 0 ? (
              <Table headers={['Thumbnail', 'Title & Duration', 'Creator Channel', 'Status', 'Views', 'Actions']}>
                {videos.map((video) => (
                  <tr key={video._id}>
                    <td>
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title} style={{ width: '65px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '65px', height: '38px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text-muted)' }}>No Cover</div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{video.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {video.duration}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{video.creatorId?.name || 'Deleted User'}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{video.creatorId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${video.status}`}>{video.status}</span>
                    </td>
                    <td>{video.views.toLocaleString()}</td>
                    <td>
                      <button 
                        className="nav-icon-btn" 
                        onClick={() => handleDeleteVideo(video._id)} 
                        title="Delete violating content"
                        style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No uploads registered on the platform.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
