'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { fetchCryptoNews } from '@/utils/api';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  body: string;
  url: string;
  published_on: number;
  imageurl: string;
  source: string;
  categories: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleNews, setVisibleNews] = useState(12);
  const newsIncrement = 12;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await fetchCryptoNews();
        setNews(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadMore = () => {
    setVisibleNews(prev => prev + newsIncrement);
  };

  if (loading) {
    return (
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Crypto News</h1>
            <p className="text-muted-foreground mt-2">Stay updated with the latest cryptocurrency news and developments</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-full mt-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Crypto News</h1>
            <p className="text-muted-foreground mt-2">Stay updated with the latest cryptocurrency news and developments</p>
          </div>
          <Card className="bg-red-50 dark:bg-red-900/10">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Crypto News</h1>
          <p className="text-muted-foreground mt-2">Stay updated with the latest cryptocurrency news and developments</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, visibleNews).map((item) => (
            <Link href={item.url} key={item.id} target="_blank" rel="noopener noreferrer">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {item.imageurl && (
                      <img 
                        src={item.imageurl} 
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {formatDate(item.published_on)} • {item.source}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{item.body}</p>
                  {item.categories && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.categories.split('|').map((category, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {category.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {visibleNews < news.length && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              variant="outline"
              className="px-8"
            >
              Load More News
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

