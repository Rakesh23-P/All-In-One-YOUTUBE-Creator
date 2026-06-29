import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Card from '../components/Card';
import { LineChart, BarChart } from '../components/Chart';
import axios from 'axios';
import { FaEye, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';

const Analytics = () => {
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalWatchTime: 0, subscribersCount: 0 });
  const [viewsChartData, setViewsChartData] = useState(null);
  const [subsChartData, setSubsChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await axios.get('/api/analytics');
        if (res.data.success) {
          setStats(res.data.totals);

          const rawData = res.data.chartData;
          const labels = rawData.map(r => new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
          
          // Views Chart Data
          const views = rawData.map(r => r.views);
          setViewsChartData({
            labels,
            datasets: [
              {
                fill: true,
                label: 'Daily Video Views',
                data: views,
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.08)',
                tension: 0.3,
              }
            ]
          });

          // Subscribers growth curve
          const subs = rawData.map(r => r.subscribersCount);
          setSubsChartData({
            labels,
            datasets: [
              {
                fill: true,
                label: 'Cumulative Subscribers Growth',
                data: subs,
                borderColor: '#ff0055',
                backgroundColor: 'rgba(255, 0, 85, 0.08)',
                tension: 0.25,
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching analytics database', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Channel <span className="gradient-text">Analytics</span>
        </h1>

        {/* Aggregated widgets */}
        <div className="grid-3 mb-3">
          <Card
            title="Channel Views"
            value={stats.totalViews.toLocaleString()}
            icon={<FaEye />}
            description="Accumulated hits"
          />
          <Card
            title="Total Subscribers"
            value={stats.subscribersCount.toLocaleString()}
            icon={<FaUsers />}
            description="Active supporters"
          />
          <Card
            title="Watch Time (Hours)"
            value={stats.totalWatchTime.toLocaleString()}
            icon={<FaClock />}
            description="Channel watch hours"
          />
        </div>

        {/* Charts panels */}
        <div className="grid-1" style={{ gap: '2rem' }}>
          {/* Subscribers Growth */}
          <div className="glass-card">
            <div className="flex-align mb-2">
              <FaChartLine style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Subscriber Growth</h3>
            </div>
            {subsChartData ? <LineChart data={subsChartData} title="Subscribers trajectory over past 30 days" /> : <p>Loading subscriber charts...</p>}
          </div>

          {/* Daily Video Traffic */}
          <div className="glass-card">
            <div className="flex-align mb-2">
              <FaChartLine style={{ color: 'var(--secondary)', fontSize: '1.2rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Daily Audience Traffic</h3>
            </div>
            {viewsChartData ? <BarChart data={viewsChartData} title="Daily video views over past 30 days" /> : <p>Loading view traffic charts...</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
