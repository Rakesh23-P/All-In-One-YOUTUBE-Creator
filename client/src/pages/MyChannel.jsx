import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axios from 'axios';
import { FaYoutube, FaUsers, FaEye, FaVideo, FaFolder, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyChannel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, subscribersCount: 0 });
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const analyticsRes = await axios.get('/api/analytics');
        if (analyticsRes.data.success) {
          setStats(analyticsRes.data.totals);
        }

        const playlistRes = await axios.get('/api/playlists');
        if (playlistRes.data.success) {
          setPlaylists(playlistRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching channel layout details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: '3rem' }}>
        {/* Custom Glowing Banner mockup */}
        <div style={{
          height: '180px',
          background: 'linear-gradient(90deg, #ff0055 0%, #7000ff 50%, #00d4ff 100%)',
          borderRadius: '16px',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1.5rem',
            background: 'rgba(8, 11, 17, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.1)'
          }} className="flex-align">
            <FaYoutube style={{ color: 'red' }} /> Verified Creator 
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="glass-card" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          marginTop: '-4rem',
          position: 'relative',
          zIndex: 5,
          padding: '2rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {/* Avatar frame */}
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #0f1524',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            flexShrink: 0,
            background: 'var(--bg-tertiary)'
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--text-muted)' }}>
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flexGrow: 1, minWidth: '250px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                {user?.channelName || `${user?.name}'s Channel`}
              </h2>
              <Link to="/profile" className="btn btn-secondary flex-align btn-sm" style={{ borderRadius: '8px' }}>
                <FaEdit /> Customize Channel
              </Link>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              @{user?.name?.toLowerCase().replace(/\s+/g, '')} • {stats.subscribersCount.toLocaleString()} Subscribers
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.75rem', maxWidth: '800px', lineHeight: '1.5' }}>
              {user?.channelDescription || "Welcome to my content creation channel. Here I manage and track video releases, schedule milestones."}
            </p>
          </div>
        </div>

        {/* Stats segment */}
        <div className="grid-3 mb-3">
          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaUsers style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{stats.subscribersCount.toLocaleString()}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Brand Supporters</span>
            </div>
          </div>
          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaEye style={{ fontSize: '2rem', color: 'var(--secondary)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{stats.totalViews.toLocaleString()}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Views</span>
            </div>
          </div>
          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaVideo style={{ fontSize: '2rem', color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{stats.totalVideos}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Videos Uploaded</span>
            </div>
          </div>
        </div>

        {/* Playlists layout */}
        <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Channel Playlists</h3>
        {playlists.length > 0 ? (
          <div className="grid-3">
            {playlists.map((playlist) => (
              <Link key={playlist._id} to="/playlists" className="glass-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'var(--transition-normal)' }}>
                <div style={{
                  height: '130px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px dashed var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  color: 'var(--primary)',
                  marginBottom: '1rem'
                }}>
                  <FaFolder />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{playlist.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {playlist.videoIds?.length || 0} Videos mapped
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No playlists configured. Create a playlist.
          </div>
        )}
      </main>
    </div>
  );
};

export default MyChannel;
