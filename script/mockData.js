
export const generateMockChartData = () => {
  const stocks = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "PYPL",
    "TSLA",
    "JPM",
    "NVDA",
    "NFLX",
    "DIS",
  ];
  const now = Math.floor(Date.now() / 1000);
  const data = {};

  stocks.forEach((symbol) => {
    const basePrice =
      {
        AAPL: 150,
        MSFT: 320,
        GOOGL: 135,
        AMZN: 125,
        PYPL: 85,
        TSLA: 210,
        JPM: 145,
        NVDA: 450,
        NFLX: 380,
        DIS: 95,
      }[symbol] || 100;

    const stockData = [];

    // Generate 5 years of daily data (1825 days)
    for (let i = 1825; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60;

      // Realistic stock price simulation with trends
      const trend = Math.sin(i * 0.01) * 20; // Long-term trend
      const volatility = (Math.random() - 0.5) * 10; // Daily volatility
      const seasonality = Math.sin(i * 0.03) * 5; // Monthly cycles

      const price = basePrice + trend + volatility + seasonality;

      stockData.push({
        timestamp,
        price: Math.max(1, Math.round(price * 100) / 100),
      });
    }

    data[symbol] = stockData;
  });

  return data;
};

export const MOCK_STATS_DATA = {
  AAPL: { bookValue: 150.25, profit: 25.5 },
  MSFT: { bookValue: 320.45, profit: 45.3 },
  GOOGL: { bookValue: 135.75, profit: 18.9 },
  AMZN: { bookValue: 125.6, profit: -5.2 },
  PYPL: { bookValue: 85.3, profit: 12.4 },
  TSLA: { bookValue: 210.8, profit: 65.75 },
  JPM: { bookValue: 145.9, profit: 22.1 },
  NVDA: { bookValue: 450.25, profit: 120.5 },
  NFLX: { bookValue: 380.4, profit: 45.8 },
  DIS: { bookValue: 95.6, profit: -8.3 },
};

export const MOCK_PROFILE_DATA = {
  AAPL: {
    summary:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services, and operates various platforms like the App Store, Apple Music, Apple Pay, and iCloud.",
  },
  MSFT: {
    summary:
      "Microsoft Corporation develops and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing. It offers office, exchange, SharePoint, Microsoft Teams, Office 365 Security and Compliance, and Skype for Business.",
  },
  GOOGL: {
    summary:
      "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments. The Google Services segment offers products and services, including ads, Android, Chrome, hardware, Gmail, Google Drive, Google Maps, Google Photos, Google Play, Search, and YouTube.",
  },
  AMZN: {
    summary:
      "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS). It sells merchandise and content purchased for resale from third-party sellers through physical stores and online stores.",
  },
  PYPL: {
    summary:
      "PayPal Holdings, Inc. operates a technology platform that enables digital payments on behalf of merchants and consumers worldwide. The company provides payment solutions under the PayPal, PayPal Credit, Braintree, Venmo, Xoom, Paydiant, and Hyperwallet products. Its platform allows consumers to send and receive payments in approximately 200 markets and in approximately 100 currencies.",
  },
  TSLA: {
    summary:
      "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally. The company operates in two segments, Automotive, and Energy Generation and Storage. The Automotive segment offers electric vehicles, as well as sells automotive regulatory credits.",
  },
  JPM: {
    summary:
      "JPMorgan Chase & Co. operates as a financial services company worldwide. It operates through four segments: Consumer & Community Banking, Corporate & Investment Bank, Commercial Banking, and Asset & Wealth Management. The company offers investment and treasury services, asset management, payments processing, and commercial banking services.",
  },
  NVDA: {
    summary:
      "NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company's Graphics segment offers GeForce GPUs for gaming and PCs, the GeForce NOW game streaming service and related infrastructure, and solutions for gaming platforms; Quadro/NVIDIA RTX GPUs for enterprise workstation graphics.",
  },
  NFLX: {
    summary:
      "Netflix, Inc. provides entertainment services. It offers TV series, documentaries, and feature films across various genres and languages. The company provides members the ability to receive streaming content through a host of internet-connected devices, including TVs, digital video players, television set-top boxes, and mobile devices.",
  },
  DIS: {
    summary:
      "The Walt Disney Company, together with its subsidiaries, operates as an entertainment company worldwide. The company operates through two segments, Disney Media and Entertainment Distribution; and Disney Parks, Experiences and Products. It operates television networks, including ABC, Disney Channel, ESPN, Freeform, FX, and National Geographic.",
  },
};
