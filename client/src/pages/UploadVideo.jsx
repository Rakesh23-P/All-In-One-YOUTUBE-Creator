import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaVideo, FaImage, FaListAlt, FaCalendarAlt } from 'react-icons/fa';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '0:00',
    status: 'draft',
    scheduledAt: '',
    playlistId: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { title, description, duration, status, scheduledAt, playlistId } = formData;

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get('/api/playlists');
        if (res.data.success) {
          setPlaylists(res.data.data);
        }
      } catch (error) {
        console.warn('Playlists fetch skipped.');
      }
    };
    fetchPlaylists();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      return toast.error('Please select a video file to upload');
    }

    setUploading(true);
    
    // Construct Multi-part FormData
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('duration', duration);
    data.append('status', status);
    data.append('playlistId', playlistId);
    
    if (status === 'scheduled' && scheduledAt) {
      data.append('scheduledAt', scheduledAt);
    }

    data.append('video', videoFile);
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      const res = await axios.post('/api/videos', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        toast.success('Video uploaded and configured successfully!');
        navigate('/videos');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload video files.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Upload <span className="gradient-text">Video</span>
        </h1>

        <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          {uploading ? (
            <div style={{ padding: '3rem 0' }}>
              <Loader />
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1rem' }}>
                Uploading files to media storage engine... Please do not close this window.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              {/* Dual File Upload Containers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Video upload box */}
                <div style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)',
                  position: 'relative'
                }}>
                  <FaVideo style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Choose Video Binary</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>MP4, MKV, AVI, MOV up to 100MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    required
                    style={{ fontSize: '0.8rem', width: '100%' }}
                  />
                  {videoFile && <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>Selected: {videoFile.name}</div>}
                </div>

                {/* Thumbnail upload box */}
                <div style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}>
                  <FaImage style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Thumbnail Cover</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>JPG, JPEG, PNG, WEBP</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ fontSize: '0.8rem', width: '100%' }}
                  />
                  {thumbnailFile && <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>Selected: {thumbnailFile.name}</div>}
                </div>
              </div>

              {/* Title & description inputs */}
              <div className="form-group">
                <label className="form-label">Video Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Catchy, engaging clip title..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Explain video topic context, tags, social links..."
                  style={{ minHeight: '100px' }}
                />
              </div>

              {/* Duration & Playlist selectors */}
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={duration}
                    onChange={onChange}
                    className="form-input"
                    placeholder="e.g. 10:15"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={status}
                    onChange={onChange}
                    className="form-select"
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Now</option>
                    <option value="scheduled">Schedule Date</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Link to Playlist</label>
                  <select
                    name="playlistId"
                    value={playlistId}
                    onChange={onChange}
                    className="form-select"
                  >
                    <option value="">No Playlist</option>
                    {playlists.map((playlist) => (
                      <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule time input details */}
              {status === 'scheduled' && (
                <div className="form-group" style={{ animation: 'fadeIn 0.25s ease' }}>
                  <label className="form-label">Choose Release Timing</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      value={scheduledAt}
                      onChange={onChange}
                      className="form-input"
                      required
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <FaCalendarAlt />
                    </span>
                  </div>
                </div>
              )}

              {/* Upload trigger */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', height: '45px', marginTop: '1.25rem' }}
              >
                <FaUpload /> Start Upload Queue
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadVideo;
