'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems: FAQItem[] = [
    {
      id: "general1",
      category: "General",
      question: "What is Coin Tide?",
      answer: "Coin Tide is a cryptocurrency tracking platform that provides real-time price data, market analysis, and news updates. It's designed to help both beginners and experienced traders stay informed about the cryptocurrency market."
    },
    {
      id: "general2",
      category: "General",
      question: "Is Coin Tide free to use?",
      answer: "Yes, Coin Tide is completely free to use. You can access all our basic features including real-time price tracking, market data, and news without any subscription fees."
    },
    {
      id: "markets1",
      category: "Markets",
      question: "How often is the price data updated?",
      answer: "Our cryptocurrency price data is updated in real-time, pulling from multiple reliable data sources to ensure accuracy and timeliness."
    },
    {
      id: "markets2",
      category: "Markets",
      question: "Which cryptocurrencies can I track?",
      answer: "Coin Tide provides tracking for a wide range of cryptocurrencies, including major coins like Bitcoin and Ethereum, as well as numerous altcoins. You can find specific cryptocurrencies using our search function."
    },
    {
      id: "technical1",
      category: "Technical",
      question: "How do I read the market charts?",
      answer: "Our charts show price movements over time. Green candles or lines indicate price increases, while red shows decreases. You can adjust the timeframe and hover over data points for detailed information."
    },
    {
      id: "technical2",
      category: "Technical",
      question: "What do the market indicators mean?",
      answer: "We display various market indicators including price, market cap, 24h volume, and price changes. These help you understand market trends and make informed decisions."
    },
    {
      id: "news1",
      category: "News & Updates",
      question: "Where does the news content come from?",
      answer: "Our news section aggregates content from reliable cryptocurrency news sources and updates regularly throughout the day to keep you informed about the latest developments."
    },
    {
      id: "news2",
      category: "News & Updates",
      question: "How can I stay updated with the latest news?",
      answer: "You can visit our News section regularly or follow us on social media for the latest updates. We post important market news and developments as they happen."
    }
  ];

  // Group FAQ items by category
  const groupedFAQs = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  // Filter FAQ items based on search query
  const filteredFAQs = Object.entries(groupedFAQs).reduce((acc, [category, items]) => {
    const filteredItems = items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about Coin Tide
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search FAQ..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {Object.entries(filteredFAQs).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {Object.keys(filteredFAQs).length === 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              No FAQ items found matching your search. Try different keywords or browse all categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
