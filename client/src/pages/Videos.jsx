import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(6);

  // Editing Modal State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    scheduledAt: '',
    playlistId: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchVideosAndPlaylists = async () => {
    try {
      const vRes = await axios.get('/api/videos');
      if (vRes.data.success) {
        setVideos(vRes.data.data);
      }

      const pRes = await axios.get('/api/playlists');
      if (pRes.data.success) {
        setPlaylists(pRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching videos', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosAndPlaylists();
  }, []);

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginated division
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handleEditClick = (video) => {
    setSelectedVideo(video);
    setEditFormData({
      title: video.title || '',
      description: video.description || '',
      status: video.status || 'draft',
      scheduledAt: video.scheduledAt ? video.scheduledAt.substring(0, 16) : '',
      playlistId: video.playlistId?._id || video.playlistId || ''
    });
    setThumbnailFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const data = new FormData();
    data.append('title', editFormData.title);
    data.append('description', editFormData.description);
    data.append('status', editFormData.status);
    data.append('playlistId', editFormData.playlistId);
    
    if (editFormData.status === 'scheduled' && editFormData.scheduledAt) {
      data.append('scheduledAt', editFormData.scheduledAt);
    } else {
      data.append('scheduledAt', '');
    }

    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      const res = await axios.put(`/api/videos/${selectedVideo._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Video updated successfully!');
        setIsEditModalOpen(false);
        fetchVideosAndPlaylists();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating video details.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this video? This clears all files and metrics.');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/videos/${id}`);
        if (res.data.success) {
          toast.success('Video deleted successfully.');
          fetchVideosAndPlaylists();
        }
      } catch (err) {
        toast.error('Failed to delete video.');
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {/* Title area */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Video <span className="gradient-text">Library</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Inspect status, update playlist structures, and queue scheduled releases.
            </p>
          </div>
          <Link to="/videos/upload" className="btn btn-primary">
            <FaPlus /> Add New Video
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-card flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
          <SearchBar 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search titles or content..." 
          />
          <div className="flex-align" style={{ gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 550 }} className="flex-align">
              <FaFilter /> Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="form-select"
              style={{ width: '130px', height: '38px', padding: '0 0.5rem' }}
            >
              <option value="all">All Content</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Videos Table */}
        {currentVideos.length > 0 ? (
          <>
            <Table headers={['Thumbnail', 'Details', 'Status', 'Metrics', 'Upload Date', 'Actions']}>
              {currentVideos.map((video) => (
                <tr key={video._id}>
                  <td>
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--glass-border)' }} />
                    ) : (
                      <div style={{ width: '80px', height: '45px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--glass-border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>No Image</div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{video.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {video.duration}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${video.status}`}>{video.status}</span>
                    {video.status === 'scheduled' && video.scheduledAt && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--warning)', marginTop: '0.2rem' }} className="flex-align">
                        <FaCalendarAlt /> {new Date(video.scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Views: {video.views.toLocaleString()}</span>
                      <span>Likes: {video.likes.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex-align" style={{ gap: '0.5rem' }}>
                      <button className="nav-icon-btn" onClick={() => handleEditClick(video)} style={{ color: 'var(--secondary)' }}>
                        <FaEdit />
                      </button>
                      <button className="nav-icon-btn" onClick={() => handleDeleteClick(video._id)} style={{ color: 'var(--danger)' }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <h3>No Videos Found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try refining your search keyword or upload a new content file.</p>
          </div>
        )}

        {/* Editing Modal details */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Video Metadata">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label className="form-label">Video Title</label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditFormChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                className="form-input"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thumbnail Cover (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="form-input"
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="form-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Playlist</label>
                <select
                  name="playlistId"
                  value={editFormData.playlistId}
                  onChange={handleEditFormChange}
                  className="form-select"
                >
                  <option value="">No Playlist</option>
                  {playlists.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {editFormData.status === 'scheduled' && (
              <div className="form-group">
                <label className="form-label">Schedule Release Time</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={editFormData.scheduledAt}
                  onChange={handleEditFormChange}
                  className="form-input"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={updating} style={{ width: '100%', height: '42px', marginTop: '1rem' }}>
              {updating ? 'Saving Changes...' : 'Save Video Configuration'}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Videos;
