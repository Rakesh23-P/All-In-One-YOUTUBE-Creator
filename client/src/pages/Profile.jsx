import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaUser, FaTv, FaAlignLeft, FaCamera, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    channelName: '',
    channelDescription: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        channelName: user.channelName || '',
        channelDescription: user.channelDescription || ''
      });
      setPreviewUrl(user.avatar || '');
    }
  }, [user]);

  const { name, channelName, channelDescription } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    // Construct multi-part Form Data
    const data = new FormData();
    data.append('name', name);
    data.append('channelName', channelName);
    data.append('channelDescription', channelDescription);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    await updateProfile(data);
    setUpdating(false);
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Channel <span className="gradient-text">Profile</span>
        </h1>

        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={onSubmit}>
            {/* Avatar upload center */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: '0 0 15px var(--primary-glow)' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
                    <FaUserCircle style={{ fontSize: '5rem', color: 'var(--text-muted)' }} />
                  </div>
                )}
                
                {/* Upload Hover Cover */}
                <label htmlFor="avatar-upload" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(8, 11, 17, 0.75)',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: '0.2s ease'
                }}>
                  <FaCamera />
                </label>
              </div>
              <input 
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                Upload custom channel avatar
              </span>
            </div>

            {/* Profile Inputs */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="form-input"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <FaUser />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Channel Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="channelName"
                  value={channelName}
                  onChange={onChange}
                  className="form-input"
                  placeholder="My YouTube Channel Name"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <FaTv />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Channel Description</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  name="channelDescription"
                  value={channelDescription}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Write a brief channel bio."
                  style={{ paddingLeft: '2.5rem', minHeight: '100px' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '20px', color: 'var(--text-muted)' }}>
                  <FaAlignLeft />
                </span>
              </div>
            </div>

            {/* Submit changes */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
              style={{ width: '100%', marginTop: '1rem', height: '45px' }}
            >
              {updating ? 'Updating channel profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
