import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaYoutube, 
  FaRocket, 
  FaChartLine, 
  FaTasks, 
  FaComments, 
  FaLock,
  FaArrowRight
} from 'react-icons/fa';

import './Landing.css';

const Landing = () => {
  const { user } = useContext(AuthContext);

  // If already authenticated, bypass landing page and go to dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const features = [
    {
      icon: <FaChartLine />,
      title: 'Advanced Analytics',
      description: 'Track subscribers growth, real-time views count, and watch hours in high-fidelity charts.'
    },
    {
      icon: <FaTasks />,
      title: 'Production Calendar & Tasks',
      description: 'Plan recording schedules and organize creator milestones on an interactive Kanban board.'
    },
    {
      icon: <FaComments />,
      title: 'Comment Sentiment Moderation',
      description: 'Audit viewer comments and toggle filters based on positive or negative text sentiment.'
    },
    {
      icon: <FaRocket />,
      title: 'Content Scheduling',
      description: 'Upload thumbnails, fill metadata, and queue videos for release at specific time slots.'
    },
    {
      icon: <FaLock />,
      title: 'Role-Based Control',
      description: 'Secure, protected paths segregating Creator activities and Admin oversight controls.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navbar overlay */}
      <header className="landing-header flex-between">
        <div className="logo flex-align">
          <FaYoutube className="logo-red-icon" />
          <span className="logo-text">YOUTUBE STUDIO</span>
        </div>
        <div className="landing-nav-btns flex-align">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge badge-published mb-2">NEW UPDATE v2.5</div>
          <h1 className="hero-title">
            The Ultimate Hub for <span className="gradient-text">YouTube Creators</span>
          </h1>
          <p className="hero-subtitle">
            Consolidate your videos, schedule releases, manage production tasks, analyze revenues, and moderate viewer sentiments in one sleek.
          </p>
          <div className="hero-ctas flex-align">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <FaArrowRight />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Creator Dashboard
            </Link>
          </div>
        </div>

        {/* Floating dashboard preview visual */}
        <div className="hero-preview-wrapper glass-card">
          <div className="preview-top-bar flex-between">
            <div className="preview-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="preview-url">youtube.studio/dashboard</div>
            <div style={{ width: 40 }}></div>
          </div>
          <div className="preview-grid">
            <div className="preview-sidebar">
              <div className="preview-bar active"></div>
              <div className="preview-bar"></div>
              <div className="preview-bar"></div>
              <div className="preview-bar"></div>
            </div>
            <div className="preview-main">
              <div className="preview-row mb-2">
                <div className="preview-mini-card"></div>
                <div className="preview-mini-card"></div>
                <div className="preview-mini-card"></div>
              </div>
              <div className="preview-graph"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Built For Content Teams & Solo Creators</h2>
        <p className="section-subtitle">Everything you need to streamline post-production and publish schedules.</p>
        <div className="grid-3 mt-3">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card feature-card">
              <div className="feature-icon-box">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Youtube Studio.</p>
      </footer>
    </div>
  );
};

export default Landing;
