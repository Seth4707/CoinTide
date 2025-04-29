const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async (endpoint: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increase timeout

    const response = await fetch(`${COINGECKO_API_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      // Add credentials if needed
      credentials: 'same-origin',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 422) {
        throw new Error('Invalid request parameters. Please check your input.');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('CryptoData API Error:', error);
    throw error;
  }
};

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
