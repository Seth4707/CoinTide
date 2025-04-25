'use client';

import { useState, useEffect } from 'react';
import { fetchCryptoData } from '@/utils/api';

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

interface SearchBarProps {
  onSearchResults: (results: Crypto[]) => void;
  onSearchingStateChange: (isSearching: boolean) => void;
}

function SearchBar({ onSearchResults, onSearchingStateChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('name');
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);

  // Fetch all cryptocurrencies once when component mounts
  useEffect(() => {
    const fetchAllCryptos = async () => {
      try {
        const data = await fetchCryptoData(
          '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false'
        );
        setAllCryptos(data);
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      }
    };

    fetchAllCryptos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        onSearchingStateChange(true);
        
        const searchResults = allCryptos.filter(crypto => {
          const searchValue = query.toLowerCase();
          if (filter === 'name') {
            return (
              crypto.name.toLowerCase().includes(searchValue) ||
              crypto.symbol.toLowerCase().includes(searchValue)
            );
          } else {
            return crypto.symbol.toLowerCase().includes(searchValue);
          }
        });

        onSearchResults(searchResults);
        onSearchingStateChange(false);
      } else {
        onSearchResults(allCryptos.slice(0, 10)); // Show top 10 by default
        onSearchingStateChange(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filter, allCryptos, onSearchResults, onSearchingStateChange]);

  return (
    <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4">
      <input
        type="text"
        placeholder="Search by name or symbol..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded w-full md:w-auto"
      >
        <option value="name">Name & Symbol</option>
        <option value="symbol">Symbol Only</option>
      </select>
    </div>
  );
}

export default SearchBar;
