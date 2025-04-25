'use client';

import { useState, useEffect } from 'react';
import { fetchCryptoData } from '../utils/api';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface CryptoListProps {
  filteredData: Crypto[];
  onCoinSelect: (coinId: string, coinName: string) => void;
  isSearching?: boolean;
}

function CryptoList({ filteredData = [], onCoinSelect, isSearching = false }: CryptoListProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const dataToDisplay = filteredData.length > 0 ? filteredData : cryptoData;

  useEffect(() => {
    const fetchData = async () => {
      if (filteredData.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCryptoData(
          '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        
        if (!Array.isArray(data) || data.length === 0) {
          setError('No cryptocurrency data available.');
        } else {
          setCryptoData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cryptocurrency data.');
        if (err.message.includes('Rate limit') && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filteredData.length, retryCount]);

  if (loading || isSearching) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Loading cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-2">Error: {error}</div>
        {error.includes('Rate limit') && (
          <button 
            onClick={() => setRetryCount(prev => prev + 1)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (dataToDisplay.length === 0) {
    return <div className="text-center p-4">No cryptocurrencies found</div>;
  }

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="w-[35%] px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Name
            </th>
            <th className="w-[20%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="w-[30%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Market Cap
            </th>
            <th className="w-[15%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {dataToDisplay.map((crypto) => (
            <tr 
              key={crypto.id} 
              onClick={() => onCoinSelect(crypto.id, crypto.name)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <td className="w-[35%] px-3 py-4">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 h-8 w-8">
                    <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td className="w-[20%] px-3 py-4">
                <div className="text-sm text-foreground text-right">
                  ${crypto.current_price.toFixed(2)}
                </div>
              </td>
              <td className="w-[30%] px-3 py-4">
                <div className="text-sm text-foreground text-right">
                  ${crypto.market_cap.toLocaleString()}
                </div>
              </td>
              <td className="w-[15%] px-3 py-4">
                <div className={`text-sm text-right ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoList;
