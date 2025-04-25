export interface CryptoHolding {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalProfit: number;
  percentageChange: number;
}