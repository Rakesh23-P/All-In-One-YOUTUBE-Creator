import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Card from '../components/Card';
import { BarChart, DoughnutChart } from '../components/Chart';
import axios from 'axios';
import { FaDollarSign, FaCoins, FaHandshake, FaShoppingBag, FaChartBar } from 'react-icons/fa';

const Revenue = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyBarData, setMonthlyBarData] = useState(null);
  const [distributionData, setDistributionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Segment sums
  const [totals, setTotals] = useState({
    total: 0,
    ads: 0,
    sponsors: 0,
    merch: 0
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get('/api/revenue');
        if (res.data.success) {
          const data = res.data.data;
          setRevenueData(data);

          // Calculate accumulated totals
          const totalAds = data.reduce((sum, r) => sum + r.adRevenue, 0);
          const totalSponsors = data.reduce((sum, r) => sum + r.sponsorRevenue, 0);
          const totalMerch = data.reduce((sum, r) => sum + r.merchRevenue, 0);
          const grandTotal = totalAds + totalSponsors + totalMerch;

          setTotals({
            total: grandTotal,
            ads: totalAds,
            sponsors: totalSponsors,
            merch: totalMerch
          });

          // Format Monthly Bar Chart
          const labels = data.map(r => {
            // "2026-06" -> "June"
            const [year, month] = r.monthYear.split('-');
            const date = new Date(year, parseInt(month) - 1, 1);
            return date.toLocaleDateString(undefined, { month: 'short' });
          });

          const adValues = data.map(r => r.adRevenue);
          const sponsorValues = data.map(r => r.sponsorRevenue);
          const merchValues = data.map(r => r.merchRevenue);

          setMonthlyBarData({
            labels,
            datasets: [
              {
                label: 'Ad Revenue',
                data: adValues,
                backgroundColor: '#00f2fe',
                borderRadius: 4
              },
              {
                label: 'Sponsor Deals',
                data: sponsorValues,
                backgroundColor: '#ff0055',
                borderRadius: 4
              },
              {
                label: 'Merchandise',
                data: merchValues,
                backgroundColor: '#f59e0b',
                borderRadius: 4
              }
            ]
          });

          // Format Source distribution Doughnut Chart
          setDistributionData({
            labels: ['AdSense Share', 'Sponsorships', 'Merchandise'],
            datasets: [
              {
                data: [totalAds, totalSponsors, totalMerch],
                backgroundColor: ['rgba(0, 242, 254, 0.8)', 'rgba(255, 0, 85, 0.8)', 'rgba(245, 158, 11, 0.8)'],
                borderColor: ['rgba(0, 242, 254, 1)', 'rgba(255, 0, 85, 1)', 'rgba(245, 158, 11, 1)'],
                borderWidth: 1,
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching revenue records', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: '3rem' }}>
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Revenue <span className="gradient-text">Analytics</span>
        </h1>

        {/* Aggregated widgets */}
        <div className="grid-4 mb-3">
          <Card
            title="Total Revenue"
            value={`$${totals.total.toLocaleString()}`}
            icon={<FaDollarSign />}
            description="Accumulated income"
          />
          <Card
            title="AdSense Revenue"
            value={`$${totals.ads.toLocaleString()}`}
            icon={<FaCoins />}
            description="Video ads earnings"
            trend="12.2%"
            trendType="up"
          />
          <Card
            title="Sponsor Payouts"
            value={`$${totals.sponsors.toLocaleString()}`}
            icon={<FaHandshake />}
            description="Corporate brand deals"
            trend="5.4%"
            trendType="up"
          />
          <Card
            title="Merchandise Sales"
            value={`$${totals.merch.toLocaleString()}`}
            icon={<FaShoppingBag />}
            description="Product sales earnings"
            trend="1.8%"
            trendType="up"
          />
        </div>

        {/* Chart panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '1.5rem' }}>
          {/* Monthly trend bar chart */}
          <div className="glass-card">
            <div className="flex-align mb-2">
              <FaChartBar style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Monthly Revenue Segments</h3>
            </div>
            {monthlyBarData ? <BarChart data={monthlyBarData} title="Revenues by month and source category" /> : <p>Loading monthly charts...</p>}
          </div>

          {/* Revenue split donut chart */}
          <div className="glass-card">
            <div className="flex-align mb-2">
              <FaChartBar style={{ color: 'var(--secondary)', fontSize: '1.25rem' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Income Source Distribution</h3>
            </div>
            {distributionData ? <DoughnutChart data={distributionData} title="Earnings percentage share" /> : <p>Loading distribution charts...</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Revenue;
