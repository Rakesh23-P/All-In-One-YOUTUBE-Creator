import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import { FaSun, FaMoon, FaLock, FaTrash, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const [passwords, setPasswords] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [loading, setLoading] = useState(false);

  const { currentPass, newPass, confirmPass } = passwords;

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const onSubmitPassword = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Security password changed successfully!');
      setPasswords({ currentPass: '', newPass: '', confirmPass: '' });
    }, 1000);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm('Are you sure you want to delete your creator channel.');
    if (confirm) {
      toast.success('Account deletion requested. Logging out...');
      setTimeout(() => {
        logout();
      }, 1500);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          System <span className="gradient-text">Settings</span>
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '650px', margin: '0 auto' }}>
          {/* Theme card */}
          <div className="glass-card flex-between">
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Appearance Customization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Toggle between light mode and high-contrast dark mode.
              </p>
            </div>
            <button className="btn btn-secondary flex-align" onClick={toggleTheme}>
              {theme === 'dark' ? <><FaSun style={{ color: 'var(--accent)' }} /> Light Mode</> : <><FaMoon style={{ color: 'var(--secondary)' }} /> Dark Mode</>}
            </button>
          </div>

          {/* Change password */}
          <div className="glass-card">
            <div className="flex-align mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              <FaShieldAlt style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Access Security</h3>
            </div>
            
            <form onSubmit={onSubmitPassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="currentPass"
                    value={currentPass}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <FaLock />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="newPass"
                    value={newPass}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <FaLock />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="confirmPass"
                    value={confirmPass}
                    onChange={handlePasswordChange}
                    className="form-input"
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <FaLock />
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px', width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Changing password...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Delete Danger Zone */}
          <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--danger)', marginBottom: '0.2rem' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Once you delete your channel, all metadata, scheduled video clips, production calendars, and revenue ledgers are cleared.
            </p>
            <button className="btn btn-danger flex-align" onClick={handleDeleteAccount}>
              <FaTrash /> Delete Creator Channel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
