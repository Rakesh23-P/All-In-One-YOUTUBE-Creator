import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register all required Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default Options Helper for beautiful dark theme aesthetics
const getDefaultOptions = (titleText) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#94a3b8', // slate-400
        font: {
          family: 'Inter, sans-serif',
          size: 11
        }
      }
    },
    title: {
      display: !!titleText,
      text: titleText,
      color: '#f8fafc',
      font: {
        family: 'Outfit, sans-serif',
        size: 14,
        weight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: '#0f1524',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.04)',
      },
      ticks: {
        color: '#94a3b8',
        font: { size: 10 }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.04)',
      },
      ticks: {
        color: '#94a3b8',
        font: { size: 10 }
      }
    }
  }
});

export const LineChart = ({ data, title, height = 300 }) => {
  const options = getDefaultOptions(title);
  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export const BarChart = ({ data, title, height = 300 }) => {
  const options = getDefaultOptions(title);
  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export const DoughnutChart = ({ data, title, height = 300 }) => {
  const baseOptions = getDefaultOptions(title);
  // Remove scale gridlines for circular chart
  const doughnutOptions = {
    ...baseOptions,
    scales: undefined
  };

  return (
    <div style={{ height, width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
};
