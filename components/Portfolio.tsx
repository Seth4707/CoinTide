'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AddCoinForm from './AddCoinForm';

interface Holding {
  coinId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}

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

export default function Portfolio() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPortfolio = async () => {
    if (!user) return;

    try {
      const { data: portfolioData, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const rawHoldings: Holding[] = portfolioData?.holdings || [];
      
      if (rawHoldings.length === 0) {
        setHoldings([]);
        setLoading(false);
        return;
      }

      // Get current prices from CoinGecko
      const coinIds = rawHoldings.map((h: Holding) => h.coinId).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currency=usd&include_24h_change=true`
      );
      const priceData = await response.json();

      // Combine holdings data with current prices
      const enrichedHoldings = rawHoldings.map((holding: Holding) => {
        const currentPrice = priceData[holding.coinId]?.usd || 0;
        const priceChange = priceData[holding.coinId]?.usd_24h_change || 0;
        const totalValue = currentPrice * holding.amount;
        const profitLoss = (currentPrice - holding.purchasePrice) * holding.amount;

        return {
          ...holding,
          current_price: currentPrice,
          price_change_24h: priceChange,
          total_value: totalValue,
          profit_loss: profitLoss
        };
      });

      setHoldings(enrichedHoldings);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setHoldings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoin = async (coinIndex: number) => {
    if (!user) {
      console.log("Cannot delete: No user logged in");
      return;
    }
    
    console.log(`Attempting to delete coin at index: ${coinIndex}`);
    
    try {
      setLoading(true);
      
      // Fetch current portfolio
      console.log("Fetching current portfolio...");
      const { data: portfolioData, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching portfolio:", fetchError);
        throw fetchError;
      }
      
      console.log("Current portfolio data:", portfolioData);
      
      // Remove the coin at the specified index
      const updatedHoldings = [...portfolioData.holdings];
      console.log(`Before removal: ${updatedHoldings.length} holdings`);
      updatedHoldings.splice(coinIndex, 1);
      console.log(`After removal: ${updatedHoldings.length} holdings`);
      
      // Update the portfolio with the coin removed
      console.log("Updating portfolio in database...");
      const { error: updateError } = await supabase
        .from('portfolios')
        .update({
          holdings: updatedHoldings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error("Error updating portfolio:", updateError);
        throw updateError;
      }
      
      console.log("Portfolio updated successfully, refreshing data...");
      // Refresh the portfolio data
      await fetchPortfolio();
      console.log("Portfolio refreshed");
      
    } catch (error) {
      console.error('Error deleting coin:', error);
      alert(`Failed to delete coin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Debug section removed */}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Portfolio</h1>
        <div className="flex gap-4">
          <AddCoinForm onSuccess={fetchPortfolio} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No coins in your portfolio yet. Add your first coin to get started!
              </p>
            ) : (
              holdings.map((holding, index) => (
                <div 
                  key={`${holding.coinId}-${index}`} 
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium capitalize">{holding.coinId}</h3>
                    <p className="text-sm text-muted-foreground">
                      {holding.amount.toLocaleString()} coins @ ${holding.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        ${holding.total_value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                      <p className={`text-sm ${holding.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.profit_loss >= 0 ? '+' : ''}
                        ${Math.abs(holding.profit_loss).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`Delete button clicked for ${holding.coinId} at index ${index}`);
                        handleDeleteCoin(index);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






