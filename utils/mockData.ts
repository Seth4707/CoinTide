// Mock data for when API calls fail

// Mock crypto list data
export const mockCryptoList = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 51432.76,
    market_cap: 1008394823754,
    total_volume: 28394726354,
    price_change_percentage_24h: 2.34
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2843.12,
    market_cap: 341283746123,
    total_volume: 15372648293,
    price_change_percentage_24h: 1.87
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.54,
    market_cap: 19283746123,
    total_volume: 1372648293,
    price_change_percentage_24h: -0.87
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 143.21,
    market_cap: 61283746123,
    total_volume: 5372648293,
    price_change_percentage_24h: 3.45
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 7.32,
    market_cap: 9283746123,
    total_volume: 872648293,
    price_change_percentage_24h: -1.23
  }
];

// Mock chart data (7 days of price history)
export const mockChartData = {
  labels: [
    "2023-05-01",
    "2023-05-02",
    "2023-05-03",
    "2023-05-04",
    "2023-05-05",
    "2023-05-06",
    "2023-05-07"
  ],
  datasets: [
    {
      label: "Price (USD)",
      data: [50123.45, 51234.56, 49876.54, 52345.67, 53456.78, 51234.56, 51432.76],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: "rgb(75, 192, 192)",
      pointBorderColor: "#fff",
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "rgb(75, 192, 192)",
      pointHoverBorderColor: "#fff"
    }
  ]
};

// Add this type definition at the top of the file
export type CoinDetailsType = {
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    max_supply: number | null;
  };
  description: { en: string };
};

// Mock coin details data
export const mockCoinDetails: Record<string, CoinDetailsType> = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "btc",
    image: {
      large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
    },
    market_data: {
      current_price: { usd: 51432.76 },
      high_24h: { usd: 52345.67 },
      low_24h: { usd: 50123.45 },
      price_change_percentage_24h: 2.34,
      market_cap: { usd: 1008394823754 },
      total_volume: { usd: 28394726354 },
      circulating_supply: 19384625,
      max_supply: 21000000
    },
    description: { 
      en: "Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto. The source code is available publicly as an open source project, anybody can look at it and be part of the developmental process." 
    }
  },
  ethereum: {
    name: "Ethereum",
    symbol: "eth",
    image: {
      large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
    },
    market_data: {
      current_price: { usd: 2843.12 },
      high_24h: { usd: 2900.45 },
      low_24h: { usd: 2800.32 },
      price_change_percentage_24h: 1.87,
      market_cap: { usd: 341283746123 },
      total_volume: { usd: 15372648293 },
      circulating_supply: 120123745,
      max_supply: null
    },
    description: { 
      en: "Ethereum is a smart contract platform that enables developers to build tokens and decentralized applications (dapps). ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network." 
    }
  }
};

// Mock portfolio data
export const mockPortfolioHoldings = [
  {
    coinId: "bitcoin",
    amount: 0.5,
    purchasePrice: 48000,
    purchaseDate: "2023-01-15",
    current_price: 51432.76,
    price_change_24h: 2.34,
    total_value: 25716.38,
    profit_loss: 1716.38
  },
  {
    coinId: "ethereum",
    amount: 3.2,
    purchasePrice: 2500,
    purchaseDate: "2023-02-20",
    current_price: 2843.12,
    price_change_24h: 1.87,
    total_value: 9097.98,
    profit_loss: 1097.98
  }
];

