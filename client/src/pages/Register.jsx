import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaYoutube, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'creator' // Default role choice
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register({ name, email, password, role });
    setLoading(false);
    if (success) {
      // Navigation is automatically handled by the useEffect above
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-primary)',
      background: 'radial-gradient(at 50% 50%, rgba(184, 0, 255, 0.04) 0px, transparent 60%)'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        padding: '2.5rem 2rem'
      }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FaYoutube style={{ color: 'var(--primary)', fontSize: '2.2rem', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-title)', letterSpacing: '0.1em' }}>
              YOUTUBE STUDIO
            </span>
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Create Creator or Admin account to get started
          </p>
        </div>

        <form onSubmit={onSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="form-input"
                placeholder=""
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <FaUser />
              </span>
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-input"
                placeholder=" "
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <FaEnvelope />
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                className="form-input"
                placeholder=""
                required
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <FaLock />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Select User Role */}
          <div className="form-group">
            <label className="form-label">Dashboard Role</label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="form-select"
            >
              <option value="creator">Content Creator Dashboard</option>
              <option value="admin">System Admin Console</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', height: '45px' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
