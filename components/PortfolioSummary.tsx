'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { CryptoHolding } from '../types/portfolio';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function PortfolioSummary() {
  const { user } = useAuth();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState<CryptoHolding[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, { usd: number }>>({});
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    if (user) {
      const savedPortfolio = localStorage.getItem('portfolio');
      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio));
      }
    }
  }, [user]);

  if (!user) {
    return (
      <section className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Sign in to view and manage your portfolio
              </p>
              <Button onClick={() => router.push('/auth')}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Portfolio Summary</CardTitle>
            <Button 
              variant="outline"
              onClick={() => router.push('/portfolio')}
            >
              View Full Portfolio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Portfolio Summary</h2>
              
              {/* Total Value Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-blue-600">Total Value</h3>
                  <p className="text-2xl font-bold mt-1">
                    ${portfolioStats.totalValue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              {/* Total Profit/Loss Card */}
              <Card className="bg-white shadow-sm mt-4">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-blue-600">Total Profit/Loss</h3>
                  <p className={`text-2xl font-bold mt-1 ${
                    portfolioStats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {portfolioStats.totalProfit >= 0 ? '+' : '-'}$
                    {Math.abs(portfolioStats.totalProfit).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

