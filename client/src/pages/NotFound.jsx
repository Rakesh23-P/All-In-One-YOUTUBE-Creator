import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(at 50% 50%, rgba(239, 68, 68, 0.05) 0px, transparent 60%)',
      textAlign: 'center'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        padding: '3rem 2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        {/* Error icon overlay */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '0.5rem',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)'
        }}>
          <FaExclamationTriangle />
        </div>

        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-title)',
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(135deg, #ef4444, #ff0055)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>

        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
          Channel Content Not Found
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>
          The playlist is empty or the video link has expired. Check the URL again.
        </p>

        {/* Action button redirect */}
        <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          <FaHome /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
