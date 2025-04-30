'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCryptoData } from '../utils/api';
import { mockChartData } from '../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  coinId: string;
  coinName: string;
}

type ChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  tension: number;
  fill: boolean;
  pointRadius: number;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverRadius: number;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
}

function Chart({ coinId, coinName }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        pointHoverBorderColor: '#fff'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchCryptoData(
          `/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`
        );

        const prices = response.prices;
        const labels = prices.map((price: [number, number]) => {
          const date = new Date(price[0]);
          return date.toLocaleDateString();
        });

        const priceData = prices.map((price: [number, number]) => price[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinName} Price (USD)`,
              data: priceData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: 'rgb(75, 192, 192)',
              pointBorderColor: '#fff',
              pointHoverRadius: 6,
              pointHoverBackgroundColor: 'rgb(75, 192, 192)',
              pointHoverBorderColor: '#fff'
            }
          ]
        });
      } catch (err) {
        console.log('All APIs failed, using mock chart data');
        // Use mock chart data when all APIs fail
        setChartData(mockChartData);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [coinId, coinName]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: '7-Day Price History',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2D3748',
        bodyColor: '#2D3748',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default Chart;
