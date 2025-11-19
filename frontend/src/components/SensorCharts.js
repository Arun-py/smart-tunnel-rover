/**
 * Live Sensor Charts Component
 * Real-time graphs for Temperature, Humidity, and Gas Level
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './SensorCharts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function SensorCharts({ history = [] }) {
  // Prepare data for charts (last 20 readings)
  const recentHistory = history.slice(-20);
  
  const labels = recentHistory.map((_, index) => `${index + 1}`);
  
  const temperatureData = recentHistory.map(d => d.temperature || 0);
  const humidityData = recentHistory.map(d => d.humidity || 0);
  const gasData = recentHistory.map(d => d.gasLevel || 0);

  // Chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.95)',
        titleColor: '#00FFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#00FFFF',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Temperature Chart Data
  const temperatureChartData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: '#00FFFF',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#00FFFF',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
      },
    ],
  };

  const temperatureOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: false,
      },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        min: 0,
        max: 50,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value) => value + '°C',
        },
      },
    },
  };

  // Humidity Chart Data
  const humidityChartData = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: '#007FFF',
        backgroundColor: 'rgba(0, 127, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#007FFF',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
      },
    ],
  };

  const humidityOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        min: 0,
        max: 100,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value) => value + '%',
        },
      },
    },
  };

  // Gas Level Chart Data
  const gasChartData = {
    labels,
    datasets: [
      {
        label: 'Gas Level (ppm)',
        data: gasData,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#FF0000',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
      },
    ],
  };

  const gasOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        min: 0,
        max: 1000,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value) => value + ' ppm',
        },
      },
    },
  };

  return (
    <div className="sensor-charts">
      <div className="chart-container">
        <div className="chart-header">
          <h3>Temperature Trend</h3>
          <span className="chart-badge temp">
            {temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].toFixed(1) : '--'}°C
          </span>
        </div>
        <div className="chart-wrapper">
          <Line data={temperatureChartData} options={temperatureOptions} />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Humidity Trend</h3>
          <span className="chart-badge humidity">
            {humidityData.length > 0 ? humidityData[humidityData.length - 1].toFixed(1) : '--'}%
          </span>
        </div>
        <div className="chart-wrapper">
          <Line data={humidityChartData} options={humidityOptions} />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Gas Level Trend</h3>
          <span className="chart-badge gas">
            {gasData.length > 0 ? gasData[gasData.length - 1] : '--'} ppm
          </span>
        </div>
        <div className="chart-wrapper">
          <Line data={gasChartData} options={gasOptions} />
        </div>
      </div>
    </div>
  );
}

export default SensorCharts;
