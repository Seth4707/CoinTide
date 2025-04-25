'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Shield, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'trading' | 'security' | 'defi';
}

const educationalResources: Resource[] = [
  // BASICS
  {
    id: '1',
    title: 'What is Cryptocurrency?',
    description: 'Learn the fundamentals of digital currencies',
    content: `Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies, cryptocurrencies are decentralized systems based on blockchain technology.

Key Points:
• Digital currency using cryptography
• Decentralized nature - no central authority
• Based on blockchain technology
• Secure and transparent transactions
• Limited supply and mining process
• Peer-to-peer transactions without intermediaries

Popular cryptocurrencies include Bitcoin, Ethereum, and many others. Each offers unique features and use cases in the digital economy.`,
    level: 'beginner',
    category: 'basics'
  },
  {
    id: '2',
    title: 'Understanding Blockchain',
    description: 'Explore the technology behind cryptocurrencies',
    content: `Blockchain is a distributed ledger technology that records transactions across many computers securely and transparently.

Key Concepts:
• Distributed ledger technology
• Immutable record keeping
• Consensus mechanisms
• Smart contracts
• Decentralized applications (dApps)
• Network security and validation

Blockchain technology has applications beyond cryptocurrencies, including supply chain management, voting systems, and more.`,
    level: 'beginner',
    category: 'basics'
  },
  {
    id: '3',
    title: 'Crypto Wallets Explained',
    description: 'Understanding different types of cryptocurrency wallets',
    content: `A cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies.

Types of Wallets:
• Hardware wallets (cold storage)
• Software wallets (hot storage)
• Mobile wallets
• Web wallets
• Paper wallets

Security Features:
• Private keys
• Public keys
• Recovery phrases
• Multi-signature options`,
    level: 'beginner',
    category: 'basics'
  },
  {
    id: '4',
    title: 'How to Buy Cryptocurrency',
    description: 'Step-by-step guide to purchasing your first crypto',
    content: `Learn the safe and proper way to purchase cryptocurrency through established channels.

Steps to Buy Crypto:
• Choose a reputable exchange
• Complete identity verification (KYC)
• Add payment method
• Place your first order
• Secure storage solutions

Important Considerations:
• Exchange fees
• Payment methods
• Local regulations
• Market timing
• Security measures`,
    level: 'beginner',
    category: 'basics'
  },

  // TRADING
  {
    id: '5',
    title: 'Trading Strategies',
    description: 'Learn common trading strategies',
    content: `This guide covers fundamental and technical analysis approaches for cryptocurrency trading.

Trading Fundamentals:
• Market analysis techniques
• Risk management
• Technical indicators
• Trading psychology
• Portfolio diversification
• Entry and exit strategies

Remember: Always do your own research and never invest more than you can afford to lose.`,
    level: 'intermediate',
    category: 'trading'
  },
  {
    id: '6',
    title: 'Technical Analysis Basics',
    description: 'Understanding charts and indicators',
    content: `Master the fundamentals of technical analysis for better trading decisions.

Key Technical Indicators:
• Moving averages
• RSI (Relative Strength Index)
• MACD (Moving Average Convergence Divergence)
• Bollinger Bands
• Volume analysis
• Support and resistance levels

Chart Patterns:
• Head and shoulders
• Double tops and bottoms
• Triangle patterns
• Flag patterns`,
    level: 'intermediate',
    category: 'trading'
  },
  {
    id: '7',
    title: 'Risk Management',
    description: 'Essential risk management strategies',
    content: `Protect your investment through proper risk management techniques.

Risk Management Principles:
• Position sizing
• Stop-loss orders
• Take-profit levels
• Portfolio allocation
• Risk-reward ratios
• Diversification strategies

Advanced Concepts:
• Volatility assessment
• Correlation analysis
• Market sentiment
• Risk calculation methods`,
    level: 'advanced',
    category: 'trading'
  },

  // SECURITY
  {
    id: '8',
    title: 'Crypto Security Best Practices',
    description: 'Keep your digital assets safe',
    content: `Essential security practices for protecting your cryptocurrency investments.

Security Guidelines:
• Use hardware wallets for large holdings
• Enable 2FA on all accounts
• Keep private keys secure
• Use strong, unique passwords
• Beware of phishing attempts
• Regular security audits
• Backup recovery phrases

Security should always be your top priority when dealing with cryptocurrencies.`,
    level: 'beginner',
    category: 'security'
  },
  {
    id: '9',
    title: 'Common Crypto Scams',
    description: 'How to identify and avoid cryptocurrency scams',
    content: `Learn about common cryptocurrency scams and how to protect yourself.

Types of Scams:
• Phishing attempts
• Fake ICOs
• Pump and dump schemes
• Fake exchanges
• Ponzi schemes
• Malware attacks

Protection Measures:
• Research thoroughly
• Verify URLs carefully
• Use official sources
• Never share private keys
• Be wary of unrealistic promises`,
    level: 'beginner',
    category: 'security'
  },
  {
    id: '10',
    title: 'Advanced Security Measures',
    description: 'Enhanced security protocols for crypto assets',
    content: `Advanced techniques to secure your cryptocurrency holdings.

Security Protocols:
• Multi-signature wallets
• Hardware security modules
• Air-gapped computers
• Cold storage solutions
• Encryption methods
• Recovery protocols

Best Practices:
• Regular security audits
• Testing recovery procedures
• Update management
• Access control systems`,
    level: 'advanced',
    category: 'security'
  },

  // DEFI
  {
    id: '11',
    title: 'Introduction to DeFi',
    description: 'Understanding Decentralized Finance',
    content: `Explore the world of DeFi and its potential to revolutionize financial services.

DeFi Concepts:
• Lending and borrowing platforms
• Decentralized exchanges (DEX)
• Yield farming
• Liquidity pools
• Smart contracts
• Governance tokens
• Risk assessment

DeFi is transforming traditional financial services through blockchain technology.`,
    level: 'intermediate',
    category: 'defi'
  },
  {
    id: '12',
    title: 'Yield Farming Explained',
    description: 'Understanding yield farming and liquidity mining',
    content: `Learn how to earn passive income through DeFi yield farming.

Key Concepts:
• Liquidity provision
• Token rewards
• APY vs APR
• Impermanent loss
• Platform risks
• Gas fees

Strategies:
• Single-sided staking
• Liquidity pairs
• Yield aggregators
• Auto-compounding`,
    level: 'advanced',
    category: 'defi'
  },
  {
    id: '13',
    title: 'Smart Contracts',
    description: 'Understanding smart contracts in DeFi',
    content: `Learn about smart contracts and their role in decentralized finance.

Smart Contract Basics:
• Automated execution
• Trustless transactions
• Code is law principle
• Contract auditing
• Common vulnerabilities
• Gas optimization

Applications:
• Token creation
• DeFi protocols
• NFT platforms
• DAO governance`,
    level: 'intermediate',
    category: 'defi'
  },
  {
    id: '14',
    title: 'DeFi Risk Management',
    description: 'Understanding and managing DeFi risks',
    content: `Learn about various risks in DeFi and how to manage them effectively.

Types of Risks:
• Smart contract risk
• Protocol risk
• Impermanent loss
• Oracle failures
• Governance attacks
• Market manipulation

Risk Management:
• Portfolio diversification
• Insurance protocols
• Risk assessment tools
• Audit verification
• Testing strategies`,
    level: 'advanced',
    category: 'defi'
  }
];

export default function EducationSection() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categoryIcons = {
    basics: <BookOpen className="h-5 w-5" />,
    trading: <TrendingUp className="h-5 w-5" />,
    security: <Shield className="h-5 w-5" />,
    defi: <Wallet className="h-5 w-5" />
  };

  const handleReadMore = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  return (
    <>
      <section className="w-full py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Learn Crypto</h2>
            <p className="text-muted-foreground mt-2">
              Master cryptocurrency with our comprehensive guides
            </p>
          </div>

          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Object.entries({
                basics: 'Basics',
                trading: 'Trading',
                security: 'Security',
                defi: 'DeFi'
              }).map(([key, label]) => (
                <TabsTrigger value={key} key={key} className="text-sm">
                  {categoryIcons[key as keyof typeof categoryIcons]}
                  <span className="ml-2">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {['basics', 'trading', 'security', 'defi'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-4 md:grid-cols-2">
                  {educationalResources
                    .filter(resource => resource.category === category)
                    .map(resource => (
                      <Card 
                        key={resource.id} 
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            {categoryIcons[resource.category as keyof typeof categoryIcons]}
                            <div>
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                              <p className="text-muted-foreground text-sm mt-1">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {resource.level}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-primary hover:text-primary-foreground"
                              onClick={() => handleReadMore(resource)}
                            >
                              Read More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource && categoryIcons[selectedResource.category as keyof typeof categoryIcons]}
              {selectedResource?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="prose dark:prose-invert max-w-none">
              {selectedResource?.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


