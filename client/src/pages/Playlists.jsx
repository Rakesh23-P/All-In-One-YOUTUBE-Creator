import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaFolder, FaPlus, FaTrash, FaPlusCircle, FaMinusCircle, FaEye } from 'react-icons/fa';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Detail view controls
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchPlaylistsAndVideos = async () => {
    try {
      const pRes = await axios.get('/api/playlists');
      if (pRes.data.success) setPlaylists(pRes.data.data);

      const vRes = await axios.get('/api/videos');
      if (vRes.data.success) setVideos(vRes.data.data);
    } catch (error) {
      console.error('Error fetching playlists data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistsAndVideos();
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter(vId => vId !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/playlists', {
        name: playlistName,
        description: playlistDesc,
        videoIds: selectedVideos
      });
      if (res.data.success) {
        toast.success('Playlist created successfully!');
        setIsCreateOpen(false);
        setPlaylistName('');
        setPlaylistDesc('');
        setSelectedVideos([]);
        fetchPlaylistsAndVideos();
      }
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (id, e) => {
    e.stopPropagation();
    const confirm = window.confirm('Are you sure you want to delete this playlist? Individual videos will NOT be deleted.');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/playlists/${id}`);
        if (res.data.success) {
          toast.success('Playlist removed.');
          if (activePlaylist?._id === id) {
            setIsDetailOpen(false);
            setActivePlaylist(null);
          }
          fetchPlaylistsAndVideos();
        }
      } catch (error) {
        toast.error('Failed to delete playlist');
      }
    }
  };

  const handleOpenDetail = (playlist) => {
    setActivePlaylist(playlist);
    setIsDetailOpen(true);
  };

  const handleRemoveFromPlaylist = async (videoId) => {
    try {
      const res = await axios.post(`/api/playlists/${activePlaylist._id}/remove`, { videoId });
      if (res.data.success) {
        toast.success('Video removed from playlist');
        // Update local detail view
        const updatedVideos = activePlaylist.videoIds.filter(v => v._id !== videoId);
        setActivePlaylist({ ...activePlaylist, videoIds: updatedVideos });
        fetchPlaylistsAndVideos();
      }
    } catch (error) {
      toast.error('Failed to remove video');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {/* Header toolbar */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Channel <span className="gradient-text">Playlists</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Create folders and categorize your videos to build viewer paths.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
            <FaPlus /> Create Playlist
          </button>
        </div>

        {/* Playlists grid */}
        {playlists.length > 0 ? (
          <div className="grid-3">
            {playlists.map((playlist) => (
              <div 
                key={playlist._id} 
                className="glass-card" 
                onClick={() => handleOpenDetail(playlist)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '220px', transition: 'var(--transition-normal)' }}
              >
                <div className="flex-between mb-2">
                  <FaFolder style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
                  <button 
                    className="nav-icon-btn" 
                    onClick={(e) => handleDeletePlaylist(playlist._id, e)}
                    style={{ color: 'var(--danger)' }}
                  >
                    <FaTrash />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>{playlist.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flexGrow: 1 }}>
                  {playlist.description || "No description provided."}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '1rem' }} className="flex-align">
                  <FaEye /> {playlist.videoIds?.length || 0} Videos linked • View details
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <h3>No Playlists Created</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Create a playlist folder to group related tutorial or channel contents.</p>
          </div>
        )}

        {/* Modal: Create Playlist */}
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Playlist">
          <form onSubmit={handleCreatePlaylist}>
            <div className="form-group">
              <label className="form-label">Playlist Name</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="form-input"
                required
                placeholder="e.g. Node JS Tutorials for Beginners"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={playlistDesc}
                onChange={(e) => setPlaylistDesc(e.target.value)}
                className="form-input"
                placeholder="Summarize playlist topics..."
                style={{ minHeight: '80px' }}
              />
            </div>

            {/* Selector list of creator's videos */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Videos to Add</label>
              <div style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.1)'
              }}>
                {videos.length > 0 ? (
                  videos.map((vid) => (
                    <label key={vid._id} className="flex-align" style={{ padding: '0.35rem 0.5rem', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(vid._id)}
                        onChange={() => handleCheckboxChange(vid._id)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      {vid.title}
                    </label>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No videos available.</div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', marginTop: '1rem' }}>
              Create Playlist
            </button>
          </form>
        </Modal>

        {/* Modal: Playlist Details view */}
        <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={activePlaylist?.name || 'Playlist Details'}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              {activePlaylist?.description || "No description set for this playlist."}
            </p>

            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Linked Videos ({activePlaylist?.videoIds?.length || 0})</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {activePlaylist?.videoIds && activePlaylist.videoIds.length > 0 ? (
                activePlaylist.videoIds.map((video) => (
                  <div key={video._id} className="flex-between" style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{video.title}</span>
                    <button 
                      className="nav-icon-btn" 
                      onClick={() => handleRemoveFromPlaylist(video._id)}
                      title="Remove from Playlist"
                      style={{ color: 'var(--danger)', fontSize: '0.95rem' }}
                    >
                      <FaMinusCircle />
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1.5rem 0' }}>
                  This playlist is empty! Add videos.
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Playlists;
