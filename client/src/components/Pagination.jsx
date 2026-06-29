import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
      padding: '0.5rem 0'
    }}>
      {/* Prev Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-secondary"
        style={{
          padding: '0.5rem 0.8rem',
          borderRadius: '8px',
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        <FaChevronLeft style={{ fontSize: '0.8rem' }} />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages).keys()].map((num) => {
        const pageNum = num + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className="btn"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
              color: 'white',
              border: '1px solid var(--glass-border)',
              fontWeight: 700,
              cursor: 'pointer',
              minWidth: '40px'
            }}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-secondary"
        style={{
          padding: '0.5rem 0.8rem',
          borderRadius: '8px',
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        <FaChevronRight style={{ fontSize: '0.8rem' }} />
      </button>
    </div>
  );
};

export default Pagination;
