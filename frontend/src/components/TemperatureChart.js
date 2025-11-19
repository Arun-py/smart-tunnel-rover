/**
 * Temperature Chart Component
 * Displays temperature and humidity data over time
 */

import React, { useState, useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';
import './TemperatureChart.css';

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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function TemperatureChart({ currentTemp, currentHumidity }) {
  const [chartData, setChartData] = useState({
    temperature: [],
    humidity: [],
    timestamps: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch historical data on mount
  useEffect(() => {
    fetchHistoricalData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchHistoricalData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update chart with current sensor data
  useEffect(() => {
    if (currentTemp !== '--' && currentHumidity !== '--') {
      updateChartData(currentTemp, currentHumidity);
    }
  }, [currentTemp, currentHumidity]);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sensor-data?limit=50`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        const temperatures = result.data.map(d => d.temperature);
        const humidities = result.data.map(d => d.humidity);
        const timestamps = result.data.map(d => 
          new Date(d.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        );
        
        setChartData({
          temperature: temperatures.reverse(),
          humidity: humidities.reverse(),
          timestamps: timestamps.reverse()
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setIsLoading(false);
    }
  };

  const updateChartData = (temp, humidity) => {
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setChartData(prev => ({
      temperature: [...prev.temperature.slice(-49), parseFloat(temp)],
      humidity: [...prev.humidity.slice(-49), parseFloat(humidity)],
      timestamps: [...prev.timestamps.slice(-49), timestamp]
    }));
  };

  const data = {
    labels: chartData.timestamps,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.temperature,
        borderColor: 'rgb(255, 136, 0)',
        backgroundColor: 'rgba(255, 136, 0, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(255, 136, 0)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y'
      },
      {
        label: 'Humidity (%)',
        data: chartData.humidity,
        borderColor: 'rgb(0, 212, 255)',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(0, 212, 255)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 15,
          usePointStyle: true
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(87, 125, 255, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10
          },
          maxRotation: 0,
          autoSkipPadding: 20
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgb(255, 136, 0)',
          font: {
            size: 11,
            weight: '600'
          },
          callback: function(value) {
            return value + '°C';
          }
        },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: 'rgb(255, 136, 0)',
          font: {
            size: 12,
            weight: '700'
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgb(0, 212, 255)',
          font: {
            size: 11,
            weight: '600'
          },
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Humidity (%)',
          color: 'rgb(0, 212, 255)',
          font: {
            size: 12,
            weight: '700'
          }
        }
      }
    }
  };

  return (
    <div className="temperature-chart">
      <div className="chart-header">
        <h3 className="chart-title">
          <svg className="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          Environmental Data Trends
        </h3>
        <div className="chart-stats">
          <div className="stat-item temp">
            <span className="stat-label">Current Temp:</span>
            <span className="stat-value">{currentTemp}°C</span>
          </div>
          <div className="stat-item humidity">
            <span className="stat-label">Current Humidity:</span>
            <span className="stat-value">{currentHumidity}%</span>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {isLoading ? (
          <div className="chart-loading">
            <div className="spinner-large"></div>
            <p>Loading chart data...</p>
          </div>
        ) : chartData.timestamps.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="chart-empty">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
            </svg>
            <p>No data available yet</p>
            <p className="chart-empty-sub">Waiting for sensor readings...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemperatureChart;
