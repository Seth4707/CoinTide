'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface EnrichedHolding {
  coinId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  current_price: number;
  price_change_24h: number;
  total_value: number;
  profit_loss: number;
}

interface PortfolioChartProps {
  holdings: EnrichedHolding[];
  timeRange: '24h' | '7d' | '30d' | '1y';
}

interface PriceDataPoint {
  timestamp: number;
  value: number;
}

export default function PortfolioChart({ holdings, timeRange }: PortfolioChartProps) {
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      if (holdings.length === 0) {
        setChartData([]);
        setLoading(false);
        return;
      }

      try {
        const days = {
          '24h': 1,
          '7d': 7,
          '30d': 30,
          '1y': 365
        }[timeRange];

        const interval = timeRange === '24h' ? 'hourly' : 'daily';

        // Fetch historical data for each coin
        const promises = holdings.map(holding =>
          axios.get(`https://api.coingecko.com/api/v3/coins/${holding.coinId}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: days,
              interval: interval
            }
          })
        );

        const responses = await Promise.all(promises);

        // Combine price data from all holdings
        const combinedData: { [timestamp: number]: number } = {};

        responses.forEach((response, index) => {
          const prices = response.data.prices;
          const amount = holdings[index].amount;

          prices.forEach(([timestamp, price]: [number, number]) => {
            // Round timestamp to nearest hour/day to ensure alignment
            const roundedTimestamp = timeRange === '24h'
              ? Math.floor(timestamp / (1000 * 60 * 60)) * (1000 * 60 * 60)
              : Math.floor(timestamp / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24);

            combinedData[roundedTimestamp] = (combinedData[roundedTimestamp] || 0) + (price * amount);
          });
        });

        // Convert to array and sort by timestamp
        const sortedData = Object.entries(combinedData)
          .map(([timestamp, value]) => ({
            timestamp: parseInt(timestamp),
            value: Number(value.toFixed(2))
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setChartData(sortedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [holdings, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return timeRange === '24h'
                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }}
            stroke="#6b7280"
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            stroke="#6b7280"
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            labelFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return timeRange === '24h'
                ? date.toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : date.toLocaleDateString([], {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}




