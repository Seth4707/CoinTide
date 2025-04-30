// API endpoints
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1';
const COINAPI_URL = 'https://rest.coinapi.io/v1';

// API keys (store these in environment variables)
const COINMARKETCAP_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY || '';
const COINAPI_KEY = process.env.NEXT_PUBLIC_COINAPI_KEY || '';

export const fetchCryptoData = async (endpoint: string) => {
  // Try CoinGecko first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${COINGECKO_API_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      credentials: 'same-origin',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Trying alternative API...');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log('CoinGecko API failed, trying CoinMarketCap...');
    
    // Try CoinMarketCap as fallback
    if (COINMARKETCAP_API_KEY) {
      try {
        // Map CoinGecko endpoint to CoinMarketCap endpoint
        let cmcEndpoint = '';
        if (endpoint.includes('/coins/markets')) {
          cmcEndpoint = '/cryptocurrency/listings/latest';
        } else if (endpoint.includes('/coins/') && endpoint.includes('/market_chart')) {
          const coinId = endpoint.split('/coins/')[1].split('/market_chart')[0];
          cmcEndpoint = `/cryptocurrency/quotes/latest?symbol=${coinId.toUpperCase()}`;
        } else if (endpoint.includes('/coins/') && !endpoint.includes('/market_chart')) {
          const coinId = endpoint.split('/coins/')[1].split('?')[0];
          cmcEndpoint = `/cryptocurrency/info?symbol=${coinId.toUpperCase()}`;
        }

        const response = await fetch(`${COINMARKETCAP_API_URL}${cmcEndpoint}`, {
          headers: {
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) throw new Error(`CoinMarketCap API error: ${response.status}`);
        
        const data = await response.json();
        return transformCoinMarketCapData(data, endpoint);
      } catch (cmcError) {
        console.log('CoinMarketCap API failed, trying CoinAPI...');
      }
    }
    
    // Try CoinAPI as second fallback
    if (COINAPI_KEY) {
      try {
        // Map CoinGecko endpoint to CoinAPI endpoint
        let coinApiEndpoint = '';
        if (endpoint.includes('/coins/markets')) {
          coinApiEndpoint = '/assets';
        } else if (endpoint.includes('/coins/') && endpoint.includes('/market_chart')) {
          const coinId = endpoint.split('/coins/')[1].split('/market_chart')[0];
          coinApiEndpoint = `/ohlcv/${coinId.toUpperCase()}/USD/history`;
        } else if (endpoint.includes('/coins/') && !endpoint.includes('/market_chart')) {
          const coinId = endpoint.split('/coins/')[1].split('?')[0];
          coinApiEndpoint = `/assets/${coinId.toUpperCase()}`;
        }

        const response = await fetch(`${COINAPI_URL}${coinApiEndpoint}`, {
          headers: {
            'X-CoinAPI-Key': COINAPI_KEY,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) throw new Error(`CoinAPI error: ${response.status}`);
        
        const data = await response.json();
        return transformCoinApiData(data, endpoint);
      } catch (coinApiError) {
        console.log('All APIs failed, using mock data');
        throw error; // Throw original error to trigger mock data fallback
      }
    }
    
    // If all APIs fail or no API keys are available
    throw error;
  }
};

// Transform CoinMarketCap data to match CoinGecko format
function transformCoinMarketCapData(data: any, originalEndpoint: string) {
  if (originalEndpoint.includes('/coins/markets')) {
    return data.data.map((coin: any) => ({
      id: coin.slug,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      current_price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      total_volume: coin.quote.USD.volume_24h,
      price_change_percentage_24h: coin.quote.USD.percent_change_24h
    }));
  } else if (originalEndpoint.includes('/market_chart')) {
    // Transform historical data
    const prices: [number, number][] = [];
    const coin = Object.values(data.data)[0] as any;
    
    // Create mock historical data based on current price and changes
    const now = Date.now();
    const price = coin.quote.USD.price;
    const change24h = coin.quote.USD.percent_change_24h / 100;
    
    // Create 7 days of mock data points
    for (let i = 0; i < 7; i++) {
      const timestamp = now - (6 - i) * 24 * 60 * 60 * 1000;
      const mockPrice = price * (1 - change24h * (6 - i) / 6);
      prices.push([timestamp, mockPrice]);
    }
    
    return { prices };
  } else {
    // Single coin details
    const coin = Object.values(data.data)[0] as any;
    return {
      name: coin.name,
      symbol: coin.symbol.toLowerCase(),
      image: {
        large: `https://s2.coinmarketcap.com/static/img/coins/128x128/${coin.id}.png`
      },
      market_data: {
        current_price: { usd: coin.quote?.USD?.price || 0 },
        high_24h: { usd: coin.quote?.USD?.price * (1 + coin.quote?.USD?.percent_change_24h / 100) || 0 },
        low_24h: { usd: coin.quote?.USD?.price * (1 - coin.quote?.USD?.percent_change_24h / 100) || 0 },
        price_change_percentage_24h: coin.quote?.USD?.percent_change_24h || 0,
        market_cap: { usd: coin.quote?.USD?.market_cap || 0 },
        total_volume: { usd: coin.quote?.USD?.volume_24h || 0 },
        circulating_supply: coin.circulating_supply || 0,
        max_supply: coin.max_supply || null
      },
      description: { en: coin.description || '' }
    };
  }
}

// Transform CoinAPI data to match CoinGecko format
function transformCoinApiData(data: any, originalEndpoint: string) {
  if (originalEndpoint.includes('/coins/markets')) {
    return data.map((coin: any) => ({
      id: coin.asset_id.toLowerCase(),
      symbol: coin.asset_id.toLowerCase(),
      name: coin.name,
      image: coin.id_icon ? `https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/${coin.id_icon}.png` : '',
      current_price: coin.price_usd,
      market_cap: coin.market_cap_usd,
      total_volume: coin.volume_1day_usd,
      price_change_percentage_24h: coin.volume_1day_usd > 0 ? ((coin.price_usd / coin.volume_1day_usd) * 100) - 100 : 0
    }));
  } else if (originalEndpoint.includes('/market_chart')) {
    // Transform OHLCV data to price history
    return {
      prices: data.map((item: any) => [
        new Date(item.time_period_start).getTime(),
        item.price_close
      ])
    };
  } else {
    // Single coin details
    const coin = Array.isArray(data) ? data[0] : data;
    return {
      name: coin.name,
      symbol: coin.asset_id.toLowerCase(),
      image: {
        large: coin.id_icon ? `https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_128/${coin.id_icon}.png` : ''
      },
      market_data: {
        current_price: { usd: coin.price_usd || 0 },
        high_24h: { usd: coin.price_usd * 1.05 || 0 }, // Estimate
        low_24h: { usd: coin.price_usd * 0.95 || 0 }, // Estimate
        price_change_percentage_24h: 0, // Not available directly
        market_cap: { usd: coin.market_cap_usd || 0 },
        total_volume: { usd: coin.volume_1day_usd || 0 },
        circulating_supply: coin.volume_1hrs_usd || 0, // Not ideal but using as placeholder
        max_supply: null
      },
      description: { en: '' } // Not available in CoinAPI
    };
  }
}

// Add a specific function for searching coins
export const searchCoins = async (searchTerm: string) => {
  try {
    // Using the coins/markets endpoint instead of search
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search coins: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter coins locally based on search term
    const filteredCoins = data.filter((coin: any) => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredCoins.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.current_price
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

export const validateCoinId = async (coinId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&per_page=1&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
};

export const fetchCryptoNews = async () => {
  const newsFeeds = [
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://cointelegraph.com/rss',
    'https://cryptonews.com/news/feed/',
    'https://bitcoinmagazine.com/.rss/full/',
    'https://decrypt.co/feed',
  ];

  try {
    const newsPromises = newsFeeds.map(async (feed) => {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch from ${feed}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      return data.items.map((item: any, index: number) => ({
        id: `${feed}-${index}`,
        title: item.title,
        body: item.description.replace(/<[^>]*>/g, ''),
        url: item.link,
        published_on: new Date(item.pubDate).getTime() / 1000,
        imageurl: item.enclosure?.link || item.thumbnail || '',
        source: new URL(feed).hostname.replace('www.', '').split('.')[0],
        categories: item.categories?.join('|') || 'Cryptocurrency'
      }));
    });

    const allNews = await Promise.all(newsPromises);
    const combinedNews = allNews
      .flat()
      .sort((a, b) => b.published_on - a.published_on); // Sort by newest first

    return combinedNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
