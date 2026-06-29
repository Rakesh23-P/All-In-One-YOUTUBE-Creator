import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Card = ({ title, value, icon, description, trend, trendType }) => {
  return (
    <div className="glass-card flex-between" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>
          {value}
        </h2>
        {description || trend ? (
          <div className="flex-align" style={{ fontSize: '0.75rem', gap: '0.35rem' }}>
            {trend && (
              <span className="flex-align" style={{ 
                color: trendType === 'up' ? 'var(--success)' : 'var(--danger)',
                fontWeight: 700
              }}>
                {trendType === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                {trend}
              </span>
            )}
            <span style={{ color: 'var(--text-muted)' }}>{description}</span>
          </div>
        ) : null}
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '0.8rem',
        fontSize: '1.5rem',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.02)'
      }}>
        {icon}
      </div>
    </div>
  );
};

export default Card;
