'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { CryptoHolding } from '../types/portfolio';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '@/lib/supabase';

interface Holding {
  coinId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}

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
      const fetchPortfolioData = async () => {
        try {
          console.log("Fetching portfolio data for user:", user.id);
          
          // Fetch portfolio data from Supabase
          const { data: portfolioData, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error("Error fetching portfolio:", error);
            throw error;
          }

          console.log("Portfolio data received:", portfolioData);
          
          const holdings: Holding[] = portfolioData?.holdings || [];
          console.log("Holdings:", holdings);
          
          if (holdings.length === 0) {
            console.log("No holdings found, setting total to 0");
            setPortfolioStats({
              totalValue: 0,
              totalProfit: 0,
            });
            return;
          }

          // Get current prices for all coins in portfolio
          const coinIds = holdings.map((h: Holding) => h.coinId).join(',');
          console.log("Fetching prices for coins:", coinIds);
          
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currency=usd&include_24h_change=true`
          );
          const priceData = await response.json();
          console.log("Price data received:", priceData);

          // Calculate total value and profit
          let totalValue = 0;
          let totalProfit = 0;

          holdings.forEach(holding => {
            const currentPrice = priceData[holding.coinId]?.usd || 0;
            const holdingValue = currentPrice * holding.amount;
            const holdingProfit = (currentPrice - holding.purchasePrice) * holding.amount;
            
            console.log(`Coin: ${holding.coinId}, Amount: ${holding.amount}, Price: $${currentPrice}, Value: $${holdingValue.toFixed(2)}`);
            
            totalValue += holdingValue;
            totalProfit += holdingProfit;
          });

          console.log(`Final Total Portfolio Value: $${totalValue.toFixed(2)}`);
          console.log(`Final Total Profit/Loss: $${totalProfit.toFixed(2)}`);

          setPortfolioStats({
            totalValue,
            totalProfit,
          });
          
          // Store current prices for reference
          setCurrentPrices(priceData);
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
          setPortfolioStats({
            totalValue: 0,
            totalProfit: 0,
          });
        }
      };

      fetchPortfolioData();
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
            <div className="text-2xl font-bold text-blue-600">
              Total: ${portfolioStats.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Portfolio Summary</h2>
              
              {/* Total Value Card */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-blue-600">Total Portfolio Value</h3>
                  <p className="text-3xl font-bold mt-1">
                    ${portfolioStats.totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sum of all coins in your portfolio
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
                    {Math.abs(portfolioStats.totalProfit).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your purchase prices
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <div className="flex justify-center mt-6">
          <Link href="/portfolio">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View Full Portfolio
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
















