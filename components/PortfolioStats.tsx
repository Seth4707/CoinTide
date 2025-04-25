'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';

interface PortfolioStats {
  totalValue: number;
  totalProfitLoss: number;
  profitLossPercentage: number;
  dailyChange: number;
  bestPerformer: {
    coin: string;
    change: number;
  };
  worstPerformer: {
    coin: string;
    change: number;
  };
}

interface EnrichedHolding {
  coinId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  current_price?: number;
  price_change_24h?: number;
  total_value?: number;
  profit_loss?: number;
}

interface PortfolioStatsProps {
  holdings: EnrichedHolding[];
}

export default function PortfolioStats({ holdings }: PortfolioStatsProps) {
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0,
    dailyChange: 0,
    bestPerformer: { coin: '', change: 0 },
    worstPerformer: { coin: '', change: 0 }
  });

  useEffect(() => {
    const fetchPrices = async () => {
      if (holdings.length === 0) return;

      try {
        const coinIds = holdings.map(h => h.coinId).join(',');
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currency=usd&include_24h_change=true`
        );

        let totalValue = 0;
        let totalCost = 0;
        let weightedDailyChange = 0;
        let bestPerformer = { coin: '', change: -Infinity };
        let worstPerformer = { coin: '', change: Infinity };

        holdings.forEach(holding => {
          const coinData = response.data[holding.coinId];
          if (!coinData) return;

          const currentPrice = coinData.usd || 0;
          const dailyChange = coinData.usd_24h_change || 0;
          const holdingValue = currentPrice * holding.amount;
          const holdingCost = holding.purchasePrice * holding.amount;

          // Update total value and cost
          totalValue += holdingValue;
          totalCost += holdingCost;

          // Update weighted daily change (weighted by holding value)
          weightedDailyChange += (dailyChange * holdingValue);

          // Update best/worst performers
          if (dailyChange > bestPerformer.change) {
            bestPerformer = { coin: holding.coinId, change: dailyChange };
          }
          if (dailyChange < worstPerformer.change) {
            worstPerformer = { coin: holding.coinId, change: dailyChange };
          }
        });

        // Calculate profit/loss
        const totalProfitLoss = totalValue - totalCost;
        const profitLossPercentage = totalCost > 0 
          ? ((totalValue - totalCost) / totalCost) * 100 
          : 0;

        // Calculate final weighted daily change percentage
        const finalDailyChange = totalValue > 0 ? weightedDailyChange / totalValue : 0;

        setStats({
          totalValue,
          totalProfitLoss,
          profitLossPercentage,
          dailyChange: finalDailyChange,
          bestPerformer,
          worstPerformer
        });
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, [holdings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Portfolio Value</h3>
        <p className="text-2xl font-bold">${stats.totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</p>
        <p className={`text-sm ${stats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} ({stats.profitLossPercentage.toFixed(2)}%)
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">24h Change</h3>
        <p className={`text-2xl font-bold ${stats.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stats.dailyChange >= 0 ? '+' : ''}{stats.dailyChange.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}%
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Best Performer</h3>
        <p className="text-2xl font-bold">{stats.bestPerformer.coin}</p>
        <p className="text-sm text-green-500">
          +{stats.bestPerformer.change.toFixed(2)}%
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Worst Performer</h3>
        <p className="text-2xl font-bold">{stats.worstPerformer.coin}</p>
        <p className="text-sm text-red-500">
          {stats.worstPerformer.change.toFixed(2)}%
        </p>
      </Card>
    </div>
  );
}




