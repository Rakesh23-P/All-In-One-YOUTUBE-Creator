import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { LineChart } from '../components/Chart';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { 
  FaVideo, 
  FaEye, 
  FaClock, 
  FaUsers, 
  FaPlus,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalWatchTime: 0, subscribersCount: 0 });
  const [chartData, setChartData] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Analytics & Totals
        const analyticsRes = await axios.get('/api/analytics');
        if (analyticsRes.data.success) {
          setStats(analyticsRes.data.totals);
          
          // Format line chart data
          const labels = analyticsRes.data.chartData.map(r => new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
          const viewsData = analyticsRes.data.chartData.map(r => r.views);
          
          setChartData({
            labels,
            datasets: [
              {
                fill: true,
                label: 'Daily Views',
                data: viewsData,
                borderColor: '#ff0055',
                backgroundColor: 'rgba(255, 0, 85, 0.08)',
                tension: 0.35,
              }
            ]
          });
        }

        // 2. Fetch Videos
        const videosRes = await axios.get('/api/videos');
        if (videosRes.data.success) {
          setRecentVideos(videosRes.data.data.slice(0, 5)); // Get latest 5 videos
        }

        // 3. Fetch Tasks
        const tasksRes = await axios.get('/api/tasks');
        if (tasksRes.data.success) {
          setTasks(tasksRes.data.data.filter(t => t.status !== 'completed').slice(0, 4));
        }

      } catch (error) {
        console.error('Error gathering dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {/* Welcome Header banner */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Creator Command <span className="gradient-text">Center</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Welcome back, {user?.name}. Here is a summary of your YouTube channel.
            </p>
          </div>
          <Link to="/videos/upload" className="btn btn-primary">
            <FaPlus /> Upload Video
          </Link>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid-4 mb-3">
          <Card 
            title="Total Videos" 
            value={stats.totalVideos} 
            icon={<FaVideo />} 
            description="Uploaded clips" 
          />
          <Card 
            title="Views Count" 
            value={stats.totalViews.toLocaleString()} 
            icon={<FaEye />} 
            description="+18.4% last month" 
            trend="18.4%"
            trendType="up"
          />
          <Card 
            title="Watch Time (Hrs)" 
            value={stats.totalWatchTime.toLocaleString()} 
            icon={<FaClock />} 
            description="+5.2% watch momentum" 
            trend="5.2%"
            trendType="up"
          />
          <Card 
            title="Subscribers" 
            value={stats.subscribersCount.toLocaleString()} 
            icon={<FaUsers />} 
            description="+120 brand supporters" 
            trend="1.2%"
            trendType="up"
          />
        </div>

        {/* Chart & Task Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Views Graph */}
          <div className="glass-card">
            <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>Channel Traffic Growth</h3>
            {chartData ? <LineChart data={chartData} title="Traffic views trend (last 30 days)" /> : <p>Loading chart analytics...</p>}
          </div>

          {/* Pending tasks checklist */}
          <div className="glass-card flex-between" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1.1rem' }}>Production Milestones</h3>
              <Link to="/tasks" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 700 }} className="flex-align">
                Manage <FaArrowRight />
              </Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id} className="flex-align" style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{task.title}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`badge`} style={{
                      backgroundColor: task.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: task.priority === 'high' ? 'var(--danger)' : 'var(--warning)',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.65rem'
                    }}>{task.priority}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', margin: 'auto' }}>
                  No pending production tasks!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="glass-card">
          <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>Recent Video Uploads</h3>
          {recentVideos.length > 0 ? (
            <Table headers={['Thumbnail', 'Video Title', 'Status', 'Views', 'Likes', 'Release Date']}>
              {recentVideos.map((video) => (
                <tr key={video._id}>
                  <td>
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} style={{ width: '60px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '60px', height: '35px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text-muted)' }}>No Image</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{video.title}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${video.status}`}>{video.status}</span>
                  </td>
                  <td>{video.views.toLocaleString()}</td>
                  <td>{video.likes.toLocaleString()}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No videos uploaded yet. Upload your first clip to start tracking views!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
