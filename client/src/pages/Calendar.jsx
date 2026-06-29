import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaTasks, FaVideo } from 'react-icons/fa';

import './Calendar.css';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [scheduledVideos, setScheduledVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date states
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected slot details modal state
  const [selectedSlotDetails, setSelectedSlotDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState('');

  const fetchCalendarItems = async () => {
    try {
      const tRes = await axios.get('/api/tasks');
      if (tRes.data.success) setTasks(tRes.data.data);

      const vRes = await axios.get('/api/videos');
      if (vRes.data.success) {
        // Filter scheduled videos
        const scheduled = vRes.data.data.filter(v => v.status === 'scheduled' && v.scheduledAt);
        setScheduledVideos(scheduled);
      }
    } catch (error) {
      console.error('Error fetching calendar data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarItems();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // First day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Click handler for a calendar day cell
  const handleDayClick = (dayNum) => {
    const clickedDate = new Date(year, month, dayNum);
    
    // Find tasks matching clicked date
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate.getDate() === dayNum &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year;
    });

    // Find scheduled videos matching clicked date
    const dayVideos = scheduledVideos.filter(v => {
      const videoDate = new Date(v.scheduledAt);
      return videoDate.getDate() === dayNum &&
        videoDate.getMonth() === month &&
        videoDate.getFullYear() === year;
    });

    const items = [
      ...dayTasks.map(t => ({ ...t, type: 'task' })),
      ...dayVideos.map(v => ({ ...v, type: 'video' }))
    ];

    setSelectedSlotDetails(items);
    setSelectedDateLabel(clickedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setIsModalOpen(true);
  };

  if (loading) return <Loader fullScreen />;

  // Create calendar grids
  const cells = [];
  
  // Empty grids leading to first day of week
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }

  // Actal day cells
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    // Check if items are scheduled on this day
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      return taskDate.getDate() === dayNum && taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });

    const dayVideos = scheduledVideos.filter(v => {
      const videoDate = new Date(v.scheduledAt);
      return videoDate.getDate() === dayNum && videoDate.getMonth() === month && videoDate.getFullYear() === year;
    });

    const hasItems = dayTasks.length > 0 || dayVideos.length > 0;

    cells.push(
      <div 
        key={`day-${dayNum}`} 
        className={`calendar-cell active ${hasItems ? 'has-items' : ''}`}
        onClick={() => handleDayClick(dayNum)}
      >
        <span className="day-number">{dayNum}</span>
        
        {/* Indicators summary */}
        <div className="cell-indicators">
          {dayVideos.length > 0 && (
            <span className="cell-indicator video" title={`${dayVideos.length} Video scheduled`}><FaVideo /></span>
          )}
          {dayTasks.length > 0 && (
            <span className="cell-indicator task" title={`${dayTasks.length} Production tasks`}><FaTasks /></span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: '3rem' }}>
        {/* Title toolbar */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Release <span className="gradient-text">Calendar</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Inspect and track content schedule, videos queued for launch, and production tasks deadlines.
            </p>
          </div>
        </div>

        {/* Calendar Box wrapper */}
        <div className="glass-card calendar-container">
          <div className="calendar-header flex-between mb-3">
            <div className="flex-align" style={{ gap: '0.75rem' }}>
              <FaCalendarAlt style={{ color: 'var(--primary)', fontSize: '1.4rem' }} />
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)' }}>
                {monthNames[month]} {year}
              </h2>
            </div>
            <div className="flex-align" style={{ gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={handlePrevMonth} style={{ padding: '0.5rem 0.8rem' }}><FaChevronLeft /></button>
              <button className="btn btn-secondary" onClick={handleNextMonth} style={{ padding: '0.5rem 0.8rem' }}><FaChevronRight /></button>
            </div>
          </div>

          {/* Weekday Labels Header */}
          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid cells */}
          <div className="calendar-grid">
            {cells}
          </div>
        </div>

        {/* Modal: Slot Details details */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Schedule on ${selectedDateLabel}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedSlotDetails.length > 0 ? (
              selectedSlotDetails.map((item, idx) => (
                <div key={idx} className="glass-card" style={{
                  padding: '1rem',
                  borderLeft: item.type === 'video' ? '4px solid var(--secondary)' : '4px solid var(--primary)',
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  <div className="flex-between">
                    <span className="badge" style={{
                      backgroundColor: item.type === 'video' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 0, 85, 0.15)',
                      color: item.type === 'video' ? 'var(--secondary)' : 'var(--primary)',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.7rem'
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                    {item.type === 'video' ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: {item.status}</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority: {item.priority}</span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {item.description || "No description set."}
                  </p>
                  {item.type === 'video' && item.duration && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                      Video Duration: {item.duration}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No events or items scheduled on this day.
              </div>
            )}
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Calendar;
