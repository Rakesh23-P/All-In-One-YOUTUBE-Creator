import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaYoutube, FaEnvelope, FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset Form
  const [loading, setLoading] = useState(false);

  // Step 1: Request Token
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('Reset key generated successfully!');
        // Capture the resetToken directly returned by our backend fallback
        if (res.data.resetToken) {
          setToken(res.data.resetToken);
          setStep(2); // Automatically advance to password overwrite step
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Overwrite Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success('Password updated successfully!');
        setStep(3); // Complete
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
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
      background: 'radial-gradient(at 50% 50%, rgba(0, 242, 254, 0.04) 0px, transparent 60%)'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        padding: '2.5rem 2rem'
      }}>
        {/* Logo Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FaYoutube style={{ color: 'var(--primary)', fontSize: '2.2rem', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-title)', letterSpacing: '0.1em' }}>
              YOUTUBE STUDIO
            </span>
          </Link>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Password Recovery
          </h3>
        </div>

        {/* Step 1: Request Email Reset Token */}
        {step === 1 && (
          <form onSubmit={handleRequestToken}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5', textAlign: 'center' }}>
              Enter your account email. The system will generate a secure recovery token on the developer console.
            </p>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem', height: '45px' }}
            >
              {loading ? 'Generating Key...' : 'Request Recovery Key'}
            </button>
          </form>
        )}

        {/* Step 2: Overwrite Password using captured token */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--success)',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              <span><strong>Developer Mode active:</strong></span>
              <span style={{ wordBreak: 'break-all', opacity: 0.8 }}>Key: {token}</span>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder=" "
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <FaLock />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Repeat password"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <FaKey />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem', height: '45px' }}
            >
              {loading ? 'Saving Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Password updated successfully! You can now log in using your new credentials.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', height: '45px' }}>
              Sign In Now
            </Link>
          </div>
        )}

        {/* Go Back Link */}
        {step !== 3 && (
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link to="/login" className="flex-align" style={{ justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
              <FaArrowLeft style={{ fontSize: '0.75rem' }} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
