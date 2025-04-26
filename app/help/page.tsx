'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

interface HelpCategory {
  title: string;
  icon: JSX.Element;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories: HelpCategory[] = [
    {
      title: "Getting Started",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: [
        {
          id: "gs1",
          title: "How to Create an Account",
          content: "Creating an account on Coin Tide is simple. Click the 'Sign Up' button in the top right corner, enter your email address and create a secure password. Verify your email address through the confirmation link we'll send you, and you're ready to start using Coin Tide."
        },
        {
          id: "gs2",
          title: "Understanding the Dashboard",
          content: "The dashboard provides an overview of cryptocurrency markets, including real-time prices, market caps, and trading volumes. You can customize your dashboard by selecting your favorite cryptocurrencies and preferred display metrics."
        },
        {
          id: "gs3",
          title: "Basic Navigation Guide",
          content: "Navigate through Coin Tide using the main menu at the top of the page. Access Markets, News, and Educational resources easily. Use the search function to find specific cryptocurrencies or content quickly."
        }
      ]
    },
    {
      title: "Using Coin Tide Features",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      articles: [
        {
          id: "ft1",
          title: "How to Track Specific Cryptocurrencies",
          content: "Use the search function in the Markets section to find specific cryptocurrencies. Click on any cryptocurrency to view detailed information, including price charts, market data, and historical performance."
        },
        {
          id: "ft2",
          title: "Reading Market Charts",
          content: "Our charts display price movements over various time periods. Green indicates price increases, while red shows decreases. Use the timeframe selector to view different periods, and hover over the chart for detailed data points."
        },
        {
          id: "ft3",
          title: "Getting Updated with Our News",
          content: "Stay informed about the latest cryptocurrency developments through our News section. Access real-time updates, market analysis, and industry insights. Visit the News page to browse trending articles and stay ahead of market movements."
        }
      ]
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Help Center</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to your questions and learn how to use Coin Tide
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for help articles..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Need personal assistance? Our support team is here to help.</p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Contact Us</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Access our educational content to learn more about crypto.</p>
              <Link href="/education">
                <Button variant="outline" className="w-full">View Resources</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Stay informed about new features and platform updates.</p>
              <Link href="/news">
                <Button variant="outline" className="w-full">View Updates</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, index) => (
            <Card key={index} className="p-6">
              <CardHeader className="px-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <Accordion type="single" collapsible className="w-full">
                  {category.articles.map((article) => (
                    <AccordionItem key={article.id} value={article.id}>
                      <AccordionTrigger>{article.title}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{article.content}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Support */}
        <Card className="mt-12 p-6 bg-primary/5">
          <CardContent className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              If you couldn't find what you're looking for, our support team is ready to assist you.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
              <Link href="/faq">
                <Button variant="outline">View FAQ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}



