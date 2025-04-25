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

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleNews, setVisibleNews] = useState(6);
  const newsIncrement = 6;

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
      day: 'numeric'
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
            <h2 className="text-3xl font-bold">Trending Crypto News</h2>
            <p className="text-muted-foreground mt-2">Stay updated with our latest crypto news</p>
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full"></div>
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
            <h2 className="text-3xl font-bold">Trending Crypto News</h2>
            <p className="text-muted-foreground mt-2">Stay updated with our latest crypto news</p>
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
          <h2 className="text-3xl font-bold">Trending Crypto News</h2>
          <p className="text-muted-foreground mt-2">Stay updated with our latest crypto news</p>
        </div>
        <div className="grid gap-4">
          {news.slice(0, visibleNews).map((item) => (
            <Link href={item.url} key={item.id} target="_blank" rel="noopener noreferrer">
              <Card className="hover:bg-muted/50 transition-colors">
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
                  <p className="text-muted-foreground line-clamp-2">{item.body}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          {visibleNews < news.length && (
            <Button
              onClick={loadMore}
              variant="outline"
              className="mx-auto px-8"
            >
              Load More News
            </Button>
          )}
          <Link href="/news" className="mx-auto">
            <Button variant="default">
              View All News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;


