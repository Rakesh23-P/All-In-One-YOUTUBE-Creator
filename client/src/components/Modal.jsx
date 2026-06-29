import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent body scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 2000,
      animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    }} onClick={onClose}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '550px',
        position: 'relative',
        background: '#0f1524',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex-between" style={{
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>
            {title}
          </h3>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.25rem'
          }} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
